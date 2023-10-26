# pacakge.json

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```








const _checkIterationEvent = ({ states, trainNames, index, trainsWork }) => {
    const tiket = {};

    trainNames.forEach((name) => {
        if (trainsWork[name] === undefined) return;

        let logMsg = `итерация ${index}:`;
        let value = states[name][index] ?? states[name].at(-1);

        const reverseValue = value.split(":").reverse().join(":");

        // проверяем наличие уже случившегося события, создаем строку для добавления информации
        const prevEvent = infoLog.checkOnEvent(value);
        let msgByPrevEvent = prevEvent === undefined ? "" : `с поездами ${prevEvent.trainNames.join(", ")} находящимися в аварии`;

        if(!tiket[value] && msgByPrevEvent && value.split(":").length === 1) {
            tiket[value] = { trainNames: [], iteration: -1, logs: '' };

            tiket[value].iteration = index;
            tiket[value].trainNames.push(name);
            tiket[value].logs = `итерация ${index}: произошло столкновение поезда  ${name} на станции ${value} ${msgByPrevEvent}`;

            states[name] = [value];
            delete trainsWork[name]
            return;
        }

        if(!tiket[reverseValue] && msgByPrevEvent && reverseValue.split(":").length > 1) {
            tiket[reverseValue] = { trainNames: [], iteration: -1, logs: '' };

            tiket[reverseValue].iteration = index;
            tiket[reverseValue].trainNames.push(name);
            tiket[reverseValue].logs = `итерация ${index}: произошло столкновение поезда  ${name} на линии ${value} ${msgByPrevEvent}`;

            states[name] = [reverseValue];
            delete trainsWork[name]
            return;
        }

        if (tiket[value] === undefined) {
            tiket[value] = { trainNames: [], iteration: -1, logs: '' };
            tiket[value].trainNames.push(name);

            return;
        }

        if (tiket[reverseValue] !== undefined && value.split(":").length > 1) {
            if (tiket[reverseValue].iteration === -1) tiket[reverseValue].iteration = index;

            if (tiket[reverseValue].trainNames.length === 1) {
                const [getSecondTrainName] = tiket[reverseValue].trainNames;

                states[getSecondTrainName] = [reverseValue];
                delete trainsWork[getSecondTrainName];
            }

            tiket[reverseValue].trainNames.push(name);
            tiket[reverseValue].logs = `итерация ${index}: произошло столкновение поездов: ${tiket[reverseValue].trainNames.join(', ')} на линии ${reverseValue} ${msgByPrevEvent}`;

            states[name] = [reverseValue];
            delete trainsWork[name]
            return;
        }

        if (tiket[value] !== undefined && value.split(":").length === 1) {
            if (tiket[value].iteration === -1) tiket[value].iteration = index;


            if (tiket[value].trainNames.length === 1) {
                const [getSecondTrainName] = tiket[value].trainNames;

                states[getSecondTrainName] = [value];
                delete trainsWork[getSecondTrainName]
            }

            tiket[value].trainNames.push(name);
            tiket[value].logs = `итерация ${index}: произошло столкновение поездов: ${tiket[value].trainNames.join(',')} на станции ${value} ${msgByPrevEvent}`;

            states[name] = [value];
            delete trainsWork[name]
            return;
        }
    });

    console.log("tiket", tiket);
    infoLog.updateEvent(tiket);
};
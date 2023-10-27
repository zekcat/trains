import { mount } from "@vue/test-utils";
import { describe, expect, test } from "vitest";
import { SettingsTeamplate } from "@/components";

describe("unit tests", () => {
    const initComponent = () => {
        const wrapper = mount(SettingsTeamplate, {
            slots: {
                body: '<div>Test body el</div>',
                button: 'Test Button',
            }
        });

        const button = wrapper.find("button");
        return { wrapper, button };
    };

    test("check emit by click", () => {
        const { wrapper, button } = initComponent();

        button.trigger("click");
        button.trigger("click");
        const emits = wrapper.emitted();
        expect(emits).toHaveProperty("action");

        const emitUpdateByClick = wrapper.emitted("action");

        expect(emitUpdateByClick).toHaveLength(2);
        expect(emitUpdateByClick[0]).toEqual([]);
    });

    test("check slots for work", () => {
        const { wrapper } = initComponent();

        expect(wrapper.html()).toContain('<div>Test body el</div>')
        expect(wrapper.html()).toContain('Test Button')
    });

    test("snaphot teamplate on renders successfully", async () => {
        const { wrapper } = initComponent();
        expect(wrapper.html()).toMatchSnapshot();
    });
});

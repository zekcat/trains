import { mount } from "@vue/test-utils";
import { describe, expect, test, vi } from "vitest";
import { InfoToltip } from "@/components/shared";

describe("unit tests", () => {
  const initComponent = () => {
    const wrapper = mount(InfoToltip, {
      props: {
        title: "Test",
        timeout: 1500,
      },
    });

    return { wrapper };
  };

  test("check props", async () => {
    const { wrapper } = initComponent();
    const { title, timeout } = wrapper.props();

    expect(timeout).toBe(1500);

    expect(title).toBe("Test");

    await wrapper.setProps({ title: "Not Test" });
    expect(wrapper.props("title")).toBe("Not Test");
  });

  test("check emit and setTimeout", async () => {
    const { wrapper } = initComponent();

    vi.useFakeTimers();
    await setTimeout(() => {
      wrapper.vm.$emit("close");
    }, 1500);

    vi.advanceTimersByTime(1500);

    const emits = wrapper.emitted();
    expect(emits).toHaveProperty("close");
  });
});

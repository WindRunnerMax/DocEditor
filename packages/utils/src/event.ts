/**
 * 阻止事件冒泡
 * @param e
 */
export const stopEvent = (e: Pick<Event, "stopPropagation">) => {
  e.stopPropagation();
};

/**
 * 阻止事件默认行为以及冒泡
 * @param e
 */
export const preventEvent = (e: Pick<Event, "preventDefault" | "stopPropagation">) => {
  e.preventDefault();
  e.stopPropagation();
};

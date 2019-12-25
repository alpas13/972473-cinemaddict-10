export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const render = (container, template, position) => {
  switch (position) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(template.getElement());
      break;
    case RenderPosition.BEFOREEND:
      container.append(template.getElement());
      break;
  }
};

export const remove = (component) => {
  component.getElement().remove();
};

export const replace = (newComponent, oldComponent) => {
  const parentElement = oldComponent.getElement().parentElement;
  const newElement = newComponent.getElement();
  const oldElement = oldComponent.getElement();

  const isExistElements = !!(parentElement && oldElement && newElement);

  if (isExistElements && parentElement.contains(oldElement)) {
    parentElement.replaceChild(newElement, oldElement);
  }
};

const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

const render = (container, template, position) => {
  switch (position) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(template.getElement());
      break;
    case RenderPosition.BEFOREEND:
      container.append(template.getElement());
      break;
  }
};

const remove = (component) => {
  component.getElement().remove();
};

const replace = (newComponent, oldComponent) => {
  const parentElement = oldComponent.getElement().parentElement;
  const newElement = newComponent.getElement();
  const oldElement = oldComponent.getElement();

  const isExistElements = !!(parentElement && oldElement && newElement);

  if (isExistElements && parentElement.contains(oldElement)) {
    parentElement.replaceChild(newElement, oldElement);
  }
};

export {RenderPosition, createElement, render, remove, replace};

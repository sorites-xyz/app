import { Signal } from "@preact/signals";
import { ComponentChildren } from "preact";

type ModalButtonProps = {
  buttonContent: ComponentChildren;
  modalContent: ComponentChildren;
  open: Signal<boolean>;
};

export function ModalButton(
  { buttonContent, modalContent, open }: ModalButtonProps,
) {
  return (
    <div class="ModalButton__wrapper">
      <div class={"ModalButton__button"} onClick={() => open.value = true}>
        {buttonContent}
      </div>

      {open.value && (
        <div
          class="ModalButton__modal_backdrop"
          onClick={() => open.value = false}
        >
          <div
            class="ModalButton__modal_content"
            onClick={(e) => e.stopPropagation()}
          >
            {modalContent}
          </div>
        </div>
      )}
    </div>
  );
}

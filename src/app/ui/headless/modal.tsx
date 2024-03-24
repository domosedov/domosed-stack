"use client";

import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTrigger,
  Heading,
  Input,
  Label,
  Modal,
  ModalOverlay,
  TextField,
} from "react-aria-components";

export const ReactAriaModalDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  return (
    <>
      <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
        <Button>Sign up…</Button>
        <ModalOverlay isDismissable className="bg-black/50 fixed inset-0">
          <Modal className="bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fixed p-10 rounded">
            <Dialog>
              <form>
                <Heading slot="title">Sign up</Heading>
                <TextField autoFocus>
                  <Label>First Name</Label>
                  <Input />
                </TextField>
                <TextField>
                  <Label>Last Name</Label>
                  <Input />
                </TextField>
                <Button onPress={close}>Submit</Button>
                <DialogTrigger>
                  <Button>Open nested modal</Button>
                  <ModalOverlay
                    isDismissable
                    className="fixed inset-0 bg-red-500/50"
                  >
                    <Modal className="bg-green-500 p-5 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <Dialog>
                        <Heading slot="title">Nested modal</Heading>
                        <Button>Close</Button>
                      </Dialog>
                    </Modal>
                  </ModalOverlay>
                </DialogTrigger>
              </form>
            </Dialog>
          </Modal>
        </ModalOverlay>
      </DialogTrigger>
    </>
  );
};

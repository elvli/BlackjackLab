"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type SessionInactivityDialogProps = {
  open: boolean;
  onContinue: () => void;
  onEnd: () => void;
};

export function SessionInactivityDialog({
  open,
  onContinue,
  onEnd,
}: SessionInactivityDialogProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>End this session?</DialogTitle>
          <DialogDescription className="leading-6">
            We have not seen any activity for 10 minutes. Do you want to keep
            this training session going or end it here?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-2 flex-col gap-2 sm:flex-col">
          <Button type="button" onClick={onContinue}>
            Continue Session
          </Button>
          <Button type="button" variant="outline" onClick={onEnd}>
            End Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

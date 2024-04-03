import React, { type FC } from "react";
import { Box, Modal } from "@mui/material";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: any;
  component: any;
  setRoute?: (route: string) => void;
};

const CustomModal: FC<Props> = ({
  setOpen,
  open,
  setRoute,
  component: Component,
}) => {
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="absolute top-[50%] left-[50%] right-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[15px] shadow p-10 outline-none">
        <Component setRoute={setRoute} setOpen={setOpen} />
      </Box>
    </Modal>
  );
};

export default CustomModal;

import { enqueueSnackbar } from "notistack";

type variantTypes = "warning" | "success" | "error";

export const messageSnakebar = (
  toastMessage: string,
  variant: variantTypes
) => {
  enqueueSnackbar(toastMessage, {
    variant: variant,
    anchorOrigin: { vertical: "top", horizontal: "right" },
    autoHideDuration: 1100,
  });
};

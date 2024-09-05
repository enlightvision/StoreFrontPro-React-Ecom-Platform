import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Rating } from "@mui/material";
import { addReview } from "../../api/ApiHelper";
import { getItem } from "../../utils/storageService";
import { useParams } from "react-router-dom";
import { messageSnakebar } from "../../utils/messageSnakebar";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  getProductReviews: () => void;
};

type reviewDataTypes = {
  review: string;
  rating: number;
};

export default function ProductReviewDialog({
  open,
  setOpen,
  getProductReviews,
}: Props) {
  const [reviewData, setreviewData] = React.useState<reviewDataTypes>({
    review: "",
    rating: 0,
  });
  const user = getItem("user", {});
  const { id } = useParams();

  const handleClose = () => {
    setOpen(false);
  };

  const handelReview = async () => {
    try {
      if (
        !reviewData.rating ||
        reviewData.rating === 0 ||
        reviewData.review === ""
      ) {
        messageSnakebar("Please Enter Valid Details!", "error");
        return;
      }

      const result = await addReview({
        userId: user._id,
        productId: id,
        ...reviewData,
      });

      if (result.status) {
        messageSnakebar("Review shared successfully!", "success");
        getProductReviews();
        setOpen(false);
        return;
      }
      messageSnakebar("Somthing went wrong!", "error");
    } catch (error: any) {
      console.log(error);
      messageSnakebar(
        error?.response?.data?.message || "Somthing went wrong",
        "error"
      );
    }
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const email = formJson.email;
            console.log(email);
            handleClose();
          },
        }}
      >
        <DialogTitle> Select Start To Give Product Review</DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <Rating
              size="large"
              value={reviewData?.rating || 0}
              name="simple-controlled"
              title="asdsa"
              onChange={(_event, newValue) => {
                // @ts-ignore
                setreviewData((pre: any) => ({ ...pre, rating: newValue }));
              }}
            />{" "}
            <TextField
              onChange={(e: any) =>
                // @ts-ignore
                setreviewData((pre: any) => ({
                  ...pre,
                  review: e.target.value,
                }))
              }
              type="text"
              label="Write Review"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handelReview}>
            Share
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

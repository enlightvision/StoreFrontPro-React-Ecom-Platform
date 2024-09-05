import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Rating,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";
import { getCategoryAndBrand } from "../../api/ApiHelper";

type Props = {
  openFilterDrawer: boolean;
  setopenFilterDrawer: (open: boolean) => void;
  setquery: (query: any) => void;
};

export default function FilterDrawer(props: Props) {
  const { openFilterDrawer, setopenFilterDrawer, setquery } = props;
  const [inputValue, setInputValue] = useState<number[]>([0, 5000]);
  const [ratingValue, setRatingValue] = useState<number | null>(0);
  const [categoryAndBrand, setCategoryAndBrand] = useState<
    { category: string[]; brand: string[] }[] | any
  >([{ category: [], brand: [] }]);
  const [localFilterQuery, setLocalFilterQuery] = useState<{
    rating: number;
    category: string[];
    brands: string[];
    price: string;
  }>({
    rating: 0,
    category: [],
    brands: [],
    price: "",
  });

  useEffect(() => {
    getCategoryAndBrandshandler();
  }, []);

  const getCategoryAndBrandshandler = async () => {
    try {
      const result: any = await getCategoryAndBrand();
      if (result && result.status) {
        setCategoryAndBrand(result.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePriceChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newValue = Number(event.target.value);
    if (index === 0) {
      setInputValue([newValue, Math.max(newValue, inputValue[1])]);
    } else {
      setInputValue([Math.min(newValue, inputValue[0]), newValue]);
    }
  };

  const handleCategoryChange = (category: string) => {
    setLocalFilterQuery((prev) => {
      const newCategories = prev.category.includes(category)
        ? prev.category.filter((cat) => cat !== category)
        : [...prev.category, category];
      return { ...prev, category: newCategories };
    });
  };

  const handleBrandChange = (brand: string) => {
    setLocalFilterQuery((prev) => {
      const newBrands = prev.brands.includes(brand)
        ? prev.brands.filter((br) => br !== brand)
        : [...prev.brands, brand];
      return { ...prev, brands: newBrands };
    });
  };

  const applyFilters = () => {
    setquery({
      ...localFilterQuery,
      price: `${inputValue[0]}-${
        inputValue[1] == 120000 ? "max" : inputValue[1]
      }`,
    });
    setopenFilterDrawer(false); // Close the drawer after saving
  };

  const toggleDrawer = (open: boolean) => () => {
    if (!open) {
      setopenFilterDrawer(false);
      setquery({ ...localFilterQuery });
    }
  };

  return (
    <Drawer
      open={openFilterDrawer}
      onClose={toggleDrawer(false)}
      anchor="right"
      transitionDuration={400}
    >
      <Box sx={{ width: 360, textAlign: "end", p: 1 }}>
        <IconButton size="large" onClick={toggleDrawer(false)}>
          <CloseIcon sx={{ fontSize: "2rem" }} />
        </IconButton>
      </Box>
      <Box
        sx={{
          width: 360,
          ".MuiAccordion-root": {
            boxShadow: "none",
          },
          ".MuiAccordionDetails-root": {
            paddingBottom: "0",
          },
        }}
      >
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography className="fw-bold">PRODUCT CATEGORIES</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ul className="row text-dark" style={{ listStyle: "none" }}>
              {categoryAndBrand?.category?.map((x: string, i: number) => (
                <li key={i} className="col-5 p-0 m-0 text-capitalize">
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={localFilterQuery.category.includes(x)}
                        onChange={() => handleCategoryChange(x)}
                      />
                    }
                    label={x}
                  />
                </li>
              ))}
            </ul>
          </AccordionDetails>
        </Accordion>
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <Typography className="fw-bold">CUSTOMER REVIEWS</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Rating
              name="simple-controlled"
              value={ratingValue}
              onChange={(_event, newValue) => {
                setRatingValue(newValue);
                setLocalFilterQuery((prev: any) => ({
                  ...prev,
                  rating: newValue,
                }));
              }}
            />
          </AccordionDetails>
        </Accordion>
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3-content"
            id="panel3-header"
          >
            <Typography className="fw-bold">BRANDS</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ul className="row text-dark" style={{ listStyle: "none" }}>
              {categoryAndBrand?.brand?.map((x: string, i: number) => (
                <li key={i} className="col-5 p-0 m-0 text-capitalize">
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={localFilterQuery.brands.includes(x)}
                        onChange={() => handleBrandChange(x)}
                      />
                    }
                    label={x}
                  />
                </li>
              ))}
            </ul>
          </AccordionDetails>
        </Accordion>
        <Accordion defaultExpanded sx={{ border: "none" }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel4-content"
            id="panel4-header"
          >
            <Typography className="fw-bold">PRICE</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <div className="range-slider">
                <span>
                  <div
                    style={{
                      textAlign: "justify",
                    }}
                  >
                    ₹ {inputValue[0]} - ₹{" "}
                    {inputValue[1] == 120000
                      ? `${inputValue[1]} + `
                      : inputValue[1]}
                  </div>
                </span>
                <input
                  type="range"
                  value={inputValue[0]}
                  onChange={(e) => handlePriceChange(e, 0)}
                  min={0}
                  max={120000}
                  step={500}
                />
                <input
                  type="range"
                  value={inputValue[1]}
                  onChange={(e) => handlePriceChange(e, 1)}
                  min={5000}
                  max={120000}
                  step={500}
                />
              </div>
              <Button
                variant="contained"
                onClick={applyFilters}
                color="inherit"
              >
                Save
              </Button>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Drawer>
  );
}

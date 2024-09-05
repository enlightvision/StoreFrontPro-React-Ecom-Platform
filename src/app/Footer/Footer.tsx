import { Apple, FacebookOutlined, Google, X } from "@mui/icons-material";
import { Box } from "@mui/material";

type Props = {};

function Footer({}: Props) {
  return (
    <footer className="section bg-footer">
      <Box className="container">
        <Box className="row">
          <Box className="col-lg-3">
            <Box className="">
              <h6 className="footer-heading text-uppercase text-white">
                Information
              </h6>
              <ul className="list-unstyled footer-link mt-4">
                <li>
                  <a href="">Pages</a>
                </li>
                <li>
                  <a href="">Our Team</a>
                </li>
                <li>
                  <a href="">Feuchers</a>
                </li>
                <li>
                  <a href="">Pricing</a>
                </li>
              </ul>
            </Box>
          </Box>
          <Box className="col-lg-3">
            <Box className="">
              <h6 className="footer-heading text-uppercase text-white">
                Ressources
              </h6>
              <ul className="list-unstyled footer-link mt-4">
                <li>
                  <a href="">Monitoring Grader </a>
                </li>
                <li>
                  <a href="">Video Tutorial</a>
                </li>
                <li>
                  <a href="">Term &amp; Service</a>
                </li>
                <li>
                  <a href="">Zeeko API</a>
                </li>
              </ul>
            </Box>
          </Box>
          <Box className="col-lg-2">
            <Box className="">
              <h6 className="footer-heading text-uppercase text-white">Help</h6>
              <ul className="list-unstyled footer-link mt-4">
                <li>
                  <a href="">Sign Up </a>
                </li>
                <li>
                  <a href="">Login</a>
                </li>
                <li>
                  <a href="">Terms of Services</a>
                </li>
                <li>
                  <a href="">Privacy Policy</a>
                </li>
              </ul>
            </Box>
          </Box>
          <Box className="col-lg-4">
            <Box className="">
              <h6 className="footer-heading text-uppercase text-white">
                Contact Us
              </h6>
              <p className="contact-info mt-4">
                Contact us if need help withanything
              </p>
              <p className="contact-info">+01 123-456-7890</p>
              <Box className="mt-5">
                <ul className="list-inline">
                  <li className="list-inline-item">
                    <a href="#">
                      <FacebookOutlined
                        sx={{ color: "white", fontSize: "2rem" }}
                      />
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a href="#">
                      <X sx={{ color: "whitesmoke", fontSize: "1.7rem" }} />
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a href="#">
                      <Google sx={{ color: "whitesmoke", fontSize: "2rem" }} />
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a href="#">
                      <Apple sx={{ color: "whitesmoke", fontSize: "2.2rem" }} />
                    </a>
                  </li>
                </ul>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className="text-center mt-5">
        <p className="footer-alt mb-0 f-14">2024 © All Rights Reserved</p>
      </Box>
    </footer>
  );
}

export default Footer;

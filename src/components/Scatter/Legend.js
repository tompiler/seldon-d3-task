import React from "react";
import styled from "styled-components";
import { labels, labelColours } from "../../fixed";

const Container = styled("div")`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  font-family: Open Sans;
`;

const LegendContainer = styled("div")`
  width: 100%;
  height: 53%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const InfoContainer = styled("div")`
  width: 100%;
  height: 47%;
  display: flex;
  flex-direction: column;
`;

const InfoTitle = styled("div")`
  width: 100%;
  font-weight: 600;
`;

const InfoBody = styled("div")`
  height: 30%;
  width: 90%;
  margin: 0 auto;
  font-size: 0.8em;
  text-align: left;
`;

const InfoBullet = styled("li")`
  margin: 1vh 0;
`;

const LegendTitle = styled("div")`
  height: 15%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const LegendTitleSpan = styled("span")`
  align-self: flex-end;
  font-weight: 600;
  color: rgb(30, 30, 30);
  margin: 0 0 2vh 0;
`;

const LegendBody = styled("div")`
  width: 100%;
  height: 70%;
  display: flex;
  flex-direction: column;
  justify-items: center;
`;

const LegendTable = styled("table")`
  width: 35%;
  margin: 0 auto;
`;

const LabelCell = styled("td")`
  font-size: 0.8em;
  color: rgb(30, 30, 30);
`;

const MarkerCell = styled("td")``;

const Legend = () => {
  return (
    <Container>
      <LegendContainer>
        <LegendTitle>
          <LegendTitleSpan>Key</LegendTitleSpan>
        </LegendTitle>
        <LegendBody>
          <div>
            <LegendTable>
              <tbody>
                {labels.map((label, i) => (
                  <tr key={i}>
                    <MarkerCell>
                      <svg width={"3vw"} height={"1vh"}>
                        <circle
                          key={i}
                          r={"0.5vh"}
                          cx={"2vw"}
                          cy={"0.5vh"}
                          style={{
                            fill: labelColours[
                              label.replace("-", "_").replace(" ", "_")
                            ],
                            opacity: 0.9,
                          }}
                        ></circle>
                      </svg>
                    </MarkerCell>
                    <LabelCell>{label}</LabelCell>
                  </tr>
                ))}
              </tbody>
            </LegendTable>
          </div>
        </LegendBody>
      </LegendContainer>
      <InfoContainer>
        <InfoTitle>Summary</InfoTitle>
        <InfoBody>
          <ul>
            <InfoBullet>
              The visualisations in this dashboard are designed to show the
              differences in the distribution of data used to train a machine
              learning model and the input data used when the model, at a 2D
              level.
            </InfoBullet>
            <InfoBullet>
              The dashboard allows the user to:
              <ul>
                <li>
                  Analyse changes in the live dataset over time using the
                  sliding brush feature on the hourly histogram plot
                </li>
                <li>
                  Switch between the training (reference) and production (live)
                  datasets
                </li>
                <li>Modify the size of the random sample of each dataset</li>
                <li>Pan/Zoom in on individual clusters based on their label</li>
                <li>
                  Detect potential outliers in either live or reference datasets
                </li>
              </ul>
            </InfoBullet>
            <InfoBullet>
              By using these features, we can detect some interesting
              characteristics in the data:
              <ul>
                <li>
                  September 4th saw a drop off in predictions from midnight made
                  by the live model by ~75%
                </li>
                <li>
                  New 'clusters' of the reduced features are detected starting
                  at midnight on September 6th and observed throughout the day
                </li>
              </ul>
            </InfoBullet>
          </ul>
        </InfoBody>
      </InfoContainer>
    </Container>
  );
};

export default Legend;

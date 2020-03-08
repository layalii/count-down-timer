import React from "react";
import { render, fireEvent, act } from "@testing-library/react";

import App from "./App";

//Rendering app test
test("Testing the  CountDownTimer App rendering", () => {
  const { getByTestId } = render(<App />);
  const input = getByTestId("count-down-input");
  const span = getByTestId("count-down-span");

  expect(input).toBeInTheDocument();
  expect(span).toBeInTheDocument();
});

//Start countDown Test
test("Testing the CountDownTimer App input / button click", () => {
  const { getByTestId } = render(<App />);
  const input = getByTestId("count-down-input");
  const span = getByTestId("count-down-span");
  const btn = getByTestId("count-down-btn");

  fireEvent.change(input, { target: { value: 3 } });
  fireEvent.click(btn);

  expect(span).toHaveTextContent("03 : 00");
});

//Message test
test("Testing the CountDownTimer App halfway message", () => {
  jest.useFakeTimers();

  const { getByTestId, getByRole } = render(<App />);
  const input = getByTestId("count-down-input");
  const btn = getByTestId("count-down-btn");
  const span = getByTestId("count-down-span");
  const alertMessage = getByRole("alert-message");

  fireEvent.change(input, { target: { value: 1 } }); // 1 minute => 60 seconds
  fireEvent.click(btn);

  expect(span).toHaveTextContent("01 : 00");

  // wait 40 seconds
  for (let i = 0; i < 40; i++) {
    act(() => {
      jest.runTimersToTime(1000);
    });
  }

  expect(span).toHaveTextContent("00 : 20");
  expect(alertMessage).toHaveTextContent("Halfway there!");
});

//Blinking test
test("Testing the CountDownTimer App message red classname and blinking", () => {
  jest.useFakeTimers();

  const { getByTestId } = render(<App />);

  const input = getByTestId("count-down-input");
  const span = getByTestId("count-down-span");
  const btn = getByTestId("count-down-btn");

  fireEvent.change(input, { target: { value: 1 } }); // 1 minute => 60 seconds
  fireEvent.click(btn);

  // wait 55 seconds
  for (let i = 0; i < 55; i++) {
    act(() => {
      jest.runTimersToTime(1000);
    });
  }

  expect(span).toHaveClass("text-danger text-blinking");
});

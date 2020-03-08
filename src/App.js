import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import classnames from "classnames";

export default () => {
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [countState, setCountState] = useState({ minutes: 0, seconds: 0 });
  const [speed, setSpeed] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const intervalIdRef = useRef();

  const _startCounter = () => {
    setCountState({
      minutes: totalMinutes,
      seconds: 0
    });
  };

  const clearIntervalFn = () => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  };

  useEffect(() => {
    if (!intervalIdRef.current && !isPaused) {
      intervalIdRef.current = setInterval(() => {
        if (countState.seconds === 0) {
          if (countState.minutes === 0) {
            // Stop Everything
            clearIntervalFn();
          } else {
            setCountState(oldState => {
              return {
                minutes: oldState.minutes - 1,
                seconds: 59
              };
            });
          }
        } else {
          setCountState(oldState => {
            return {
              minutes: oldState.minutes,
              seconds: oldState.seconds - 1
            };
          });
        }
      }, 1000 / speed);
    }

    return clearIntervalFn;
  }, [countState, speed, isPaused]);

  const getMessageText = () => {
    if (totalMinutes > 0) {
      if (!intervalIdRef.current) return "";

      const totalSeconds = totalMinutes * 60;
      const passedSeconds =
        totalSeconds - (countState.minutes * 60 + countState.seconds);
      if (totalSeconds === passedSeconds) return "Time's up!";
      if (passedSeconds >= totalSeconds / 2) return "Halfway there!";
    }

    return "";
  };

  return (
    <div className="container pt-5">
      <h2 className="mb-5 text-center" style={{ fontFamily: "sans-serif" }}>
        COUNT DOWN TIMER
      </h2>
      <div className="align-items-center d-flex justify-content-center mb-4">
        <h4 className="mr-3 lead">CountDown:</h4>
        <input
          className="form-control w-25 mr-3 py-2"
          data-testid="count-down-input"
          placeholder="Enter minutes"
          value={totalMinutes}
          type="number"
          min="0"
          onChange={e => {
            e.preventDefault();
            setTotalMinutes(parseInt(e.target.value));
          }}
        />
        <button
          className="btn btn-success px-4"
          data-testid="count-down-btn"
          onClick={e => {
            e.preventDefault();
            _startCounter();
          }}
        >
          Start
        </button>
      </div>
      <div className="flex">
        <p role="alert-message" className="mb-0 text-center">
          {getMessageText()}
        </p>
        <div className="align-items-center d-flex justify-content-center">
          <span
            data-testid="count-down-span"
            className={classnames(
              "font-weight-bold",
              {
                "text-danger":
                  intervalIdRef.current &&
                  countState.minutes === 0 &&
                  countState.seconds <= 20
              },
              {
                "text-blinking":
                  intervalIdRef.current &&
                  countState.minutes === 0 &&
                  countState.seconds <= 10
              }
            )}
            style={{ fontSize: 70 }}
          >
            {countState.minutes < 10
              ? `0${countState.minutes}`
              : countState.minutes}{" "}
            :{" "}
            {countState.seconds < 10
              ? `0${countState.seconds}`
              : countState.seconds}
          </span>
        </div>
        <div className="d-flex justify-content-center pt-3 pb-4">
          <button
            className="btn btn-outline-success"
            onClick={e => {
              e.preventDefault();
              setIsPaused(isPaused => !isPaused);
            }}
          >
            {isPaused ? "Resume" : "Pause"}
          </button>
        </div>

        <div className="d-flex justify-content-center">
          {[1, 1.5, 2].map(spd => {
            return (
              <button
                key={spd}
                className="btn btn-light text-black-50 mx-4"
                style={{ width: 80, height: 40 }}
                onClick={e => {
                  e.preventDefault();
                  setSpeed(spd);
                }}
              >
                {spd}X
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

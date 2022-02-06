import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Medicine(props) {
  let navigate = useNavigate();
  const [prescription, setPrescription] = useState([]);
  let days = ["sun", "mon", "tue", "wed", "thurs", "fri", "sat",];
  let dayCounter = 0;

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
    if (localStorage.getItem("role") === "doctor") {
      navigate("*");
    }
    getPrescription();
    // eslint-disable-next-line
  }, []);

  async function getPrescription() {
    const response = await fetch(
      `http://localhost:5000/api/prescription/fetchtodayMeds`,
      {
        method: "GET",
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    const prescriptions = await response.json();
    setPrescription(prescriptions);
  }
  async function handleEaten(prescriptionId, medId, state) {
    let eatenTime = "";
    if (state !== "info") {
      eatenTime = new Date().toDateString();
    }
    const response = await fetch(
      `http://localhost:5000/api/prescription/updatePrescription/${prescriptionId}/${medId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          state: state,
          eatenTime: eatenTime,
        }),
      }
    );
    const prescriptions = await response.json();
    console.log(prescriptions);
    setPrescription(prescriptions);
  }

  return (
    <div className="container">
      <div className="mx-3 card mt-4">
        {
          <div className="col-12">
            <h2 className="mx-4">Medicine Tracker</h2>
            <div className="row">
              {prescription.map((prescription, index) => (
                <>
                  {prescription.medicines.map((med, index) => (
                    <>
                      {med.frequency.map((freq, index) => (
                        <>
                          {freq === days[new Date().getDay()] ? (
                            <>
                              <b className="d-none">{dayCounter++}</b>
                              <div className="card-body">
                                <div
                                  className={`alert mx-4 alert-${med.state}`}
                                  role="alert"
                                >
                                  <div className="row">
                                    <div className="col-8 justify-content-center align-self-center">
                                      <b>Medicine Name: </b>
                                      {med.name} &nbsp; &nbsp;&nbsp;
                                      <b>Eat at:</b> {med.dosage}&nbsp;
                                      &nbsp;&nbsp; <b>Eat: </b>
                                      {med.time} food
                                    </div>

                                    <div className="col-4">
                                      <form>
                                        <button
                                          className="btn btn-success"
                                          onClick={(e) =>
                                            handleEaten(
                                              prescription._id,
                                              med._id,
                                              "success"
                                            )
                                          }
                                        >
                                          <i
                                            className="fa fa-check"
                                            aria-hidden="true"
                                          ></i>
                                          &nbsp;Eaten
                                        </button>

                                        <button
                                          className="btn btn-danger mx-2"
                                          onClick={(e) =>
                                            handleEaten(
                                              prescription._id,
                                              med._id,
                                              "danger"
                                            )
                                          }
                                        >
                                          <i
                                            className="fa fa-close"
                                            aria-hidden="true"
                                          ></i>
                                          &nbsp; Missed
                                        </button>
                                        <button
                                          className="btn btn-primary"
                                          onClick={(e) =>
                                            handleEaten(
                                              prescription._id,
                                              med._id,
                                              "info"
                                            )
                                          }
                                        >
                                          <i
                                            className="fa fa-refresh"
                                            aria-hidden="true"
                                          ></i>
                                          &nbsp; Reset
                                        </button>
                                      </form>
                                    </div>


                                  </div>
                                </div>
                              </div>
                            </>
                          ) : (
                            <></>
                          )}
                        </>
                      ))}
                    </>
                  ))}
                </>
              ))}
              {dayCounter === 0 ? (
                <h4 className="px-4 mx-3">
                  {console.log(days[new Date().getDay()])}
                  No medicines to take today</h4>
              ) : (
                <></>
              )}
            </div>
          </div>
        }
      </div>
    </div>
  );
}

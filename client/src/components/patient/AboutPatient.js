import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AboutPatient(props) {
  let navigate = useNavigate();
  const [profile, setProfile] = useState([]);
  const [bookings, setBooking] = useState([]);
  const [prescription, setPrescription] = useState([]);
  const [disease, setDisease] = useState("");
  const [saveDisplay, setsaveDisplay] = useState("");
  const [excercise, setExcercise] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
    if (localStorage.getItem("role") === "doctor") {
      navigate("*");
    }
    getUser();
    getBooking();
    getPrescription();
    getExcercise();
    // eslint-disable-next-line
  }, []);

  // Separate function to get user details

  async function getUser() {
    const response = await fetch(`http://localhost:5000/api/auth/getUser`, {
      method: "GET",
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    });
    const data = await response.json();
    setProfile(data);
    setDisease(data.disease);
  }
  async function getBooking() {
    const response = await fetch(
      `http://localhost:5000/api/calendar/fetchmenteeBooking`,
      {
        method: "GET",
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    const data = await response.json();
    setBooking(data);
  }

  const refillPrescription = async (id, e) => {
    props.showAlert("Refill Request Sent Succesfully", "success");
    //call api for deleting prescription
    const response = await fetch(
      `http://localhost:5000/api/prescription/refillPrescription/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          refill: true,
        }),
      }
    );
    await response.json();
    e.target.className = e.target.className + "disabled";
    // setPrescription(data);
    // const newPrescriptions = prescription.filter((prescription) => {
    //   return prescription._id !== id;
    // });
    // setPrescription(newPrescriptions);
  };
  const completeExcercise = async (id, e) => {
    props.showAlert(
      "YAYY! We have notfied the doctor of your excercise status",
      "success"
    );
    //call api for deleting prescription
    const response = await fetch(
      `http://localhost:5000/api/excercise/completeExcercise/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          completed: true,
        }),
      }
    );
    await response.json();
    e.target.className = e.target.className + "disabled";
    // setExcercise(data);
    // const newPrescriptions = prescription.filter((prescription) => {
    //   return prescription._id !== id;
    // });
    // setPrescription(newPrescriptions);
  };

  async function getPrescription() {
    const response = await fetch(
      `http://localhost:5000/api/prescription/fetchprescriptionpatient`,
      {
        method: "GET",
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    const data = await response.json();
    setPrescription(data);
  }
  async function getExcercise() {
    const response = await fetch(
      `http://localhost:5000/api/excercise/fetchexcercisepatient`,
      {
        method: "GET",
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    const data = await response.json();
    setExcercise(data);
  }

  const updateDisease = async () => {
    props.showAlert("Disease updated succesfully", "success");
    const response = await fetch(
      `http://localhost:5000/api/auth/updateDisease`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ disease }),
      }
    );
    await response.json();
    setsaveDisplay("");
  };

  return (
    <div className="container">
      <div className="container rounded bg-white">
        <div className="row">
          <div
            className="w3-content w3-margin-top"
            style={{ maxWidth: "1400px" }}
          >
            <div className="w3-row-padding">
              <div className="w3-third">
                <div className="w3-white w3-text-grey w3-card-4">
                  <div className="w3-display-container">
                    <img
                      src={profile.img}
                      style={{ width: "100%" }}
                      alt="Avatar"
                    />
                  </div>
                </div>
                <br />
              </div>
              <div className="w3-twothird">
                <div className="w3-container w3-card w3-white w3-margin-bottom">
                  <div className="w3-container">
                    <br />
                    <h2 className="w3-text-grey w3-padding-16">
                      <i className="fa fa-certificate fa-fw w3-margin-right w3-xxlarge w3-text-blue"></i>
                      About {profile.name}
                    </h2>
                    <hr />
                    <p>
                      <i className="fa fa-home fa-fw w3-margin-right w3-large w3-text-blue"></i>
                      {profile.location}
                    </p>
                    <p>
                      <i className="fa fa-envelope fa-fw w3-margin-right w3-large w3-text-blue"></i>
                      {profile.email}
                    </p>
                    <p>
                      <i className="fa fa-phone fa-fw w3-margin-right w3-large w3-text-blue"></i>
                      {profile.phone}
                    </p>
                    <p>
                      <i className="fa fa-disease fa-fw w3-margin-right w3-large w3-text-blue"></i>
                      Symptoms -
                      <input
                        type="text"
                        className="d-inline px-2"
                        id="disease"
                        name="disease"
                        value={disease}
                        style={{
                          borderTop: "hidden",
                          borderRight: "hidden",
                          borderLeft: "hidden",
                          borderColor: "rgb(240, 240, 240)",
                        }}
                        onChange={(e) => {
                          setDisease(e.target.value);
                          setsaveDisplay("dsplay");
                        }}
                        minLength={3}
                        required
                      />
                      <button
                        className={
                          saveDisplay === ""
                            ? " mx-2 py-1 btn btn-primary btn-sm d-none"
                            : " mx-2 py-1 btn btn-primary btn-sm"
                        }
                        onClick={() => {
                          updateDisease();
                        }}
                        type="button"
                      >
                        Save
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-0">
        {
          <div className="col-12">
            <h2>Appointments</h2>
            <div className="row">
              <h4 className="mt-2">
                {bookings.length === 0 && "No Appointments Yet"}
              </h4>
              {bookings.map((booking, index) => (
                <div className="col-3 mb-xl-5 mb-7 mb-sm-6 mb-md-6 mb-lg-6 d-flex">
                  <div className="card" style={{ width: "18rem" }}>
                    <div className="card-body">
                      <h4>Appointment for {booking.title}</h4>
                      <p
                        className="card-text"
                        style={{ fontSize: "14px", marginBottom: "0.3rem" }}
                      >
                        <b>Start Date :</b> {booking.start.substring(0, 10)}
                      </p>
                      <p
                        className="card-text"
                        style={{ fontSize: "14px", marginBottom: "0.3rem" }}
                      >
                        <b>Doctor :</b> {booking.doctor}
                      </p>
                      <Link
                        type="button"
                        className="btn btn-primary btn-sm mx-2 mt-2"
                        to={`/viewProfile/${booking.user}`}
                      >
                        View Doctor &nbsp;
                        <i className="fas fa-greater-than"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        }
      </div>
      <div className="row">
        <h2>Prescription</h2>

        <h4 className="mt-2">
          {prescription.length === 0 && "No Prescriptions Yet"}
        </h4>
        {prescription.map((prescription, index) => (
          <div className="w3-half">
            <div className="w3-container w3-card w3-white w3-margin-bottom">
              <div className="row">
                <div key={index} className="w3-container">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-8">
                        <h4>Prescription by {prescription.doctorName}</h4>{" "}
                      </div>
                      <div className="col-4 float-end">
                        <button
                          className={
                            prescription.refill
                              ? "btn btn-success disabled"
                              : "btn btn-success "
                          }
                          onClick={(e) => {
                            refillPrescription(prescription._id, e);
                          }}
                        >
                          Refill Request
                        </button>
                      </div>
                    </div>
                    <div class="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Medicine Name</th>
                            <th scope="col">Dosage</th>
                            <th scope="col">Time</th>
                            <th scope="col">Frequency</th>
                            <th scope="col">Duration</th>
                          </tr>
                        </thead>
                        <tbody>
                          {prescription.medicines.map((med, index) => (
                            <tr>
                              <th scope="row">{index + 1}</th>
                              <td>{med.name}</td>
                              <td>{med.dosage}</td>
                              <td>{med.time}</td>
                              <td>
                                {med.frequency.map((freq, index) => (
                                  <>
                                    {index === med.frequency.length - 1
                                      ? freq + " "
                                      : freq + ", "}
                                  </>
                                ))}
                              </td>
                              <td>{med.duration} days</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <h6>
                        <b>Starting Date: </b>
                        {prescription.startDate}
                      </h6>
                    </div>
                    <div className="row">
                      <div className="col-8">
                        {prescription.note ? (
                          <>
                            <b className="d-block">Special Instruction</b>
                            {prescription.note}
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="col-4">
                        <a
                          type="button"
                          href="https://calendar.google.com/calendar"
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-primary"
                        >
                          Set Reminder
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="row mt-4">
        <h2>Post-care Activities</h2>

        <h4 className="mt-2">
          {excercise.length === 0 && "No Activities Assigned Yet"}
        </h4>
        {excercise.map((activity, index) => (
          <div className="w3-half">
            <div className="w3-container w3-card w3-white w3-margin-bottom">
              <div className="row">
                <div key={index} className="w3-container">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-8">
                        <h4>Activity by {activity.doctorName}</h4>{" "}
                      </div>
                      <div className="col-4 float-end">
                        <button
                          className={
                            activity.completed
                              ? "btn btn-success disabled"
                              : "btn btn-success "
                          }
                          onClick={(e) => {
                            completeExcercise(activity._id, e);
                          }}
                        >
                          Completed
                        </button>
                      </div>
                    </div>
                    <div class="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Exercise Name</th>
                            <th scope="col">Severity</th>
                            <th scope="col">Per Activity Time</th>
                            <th scope="col">Total Times</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activity.excercises.map((activity, index) => (
                            <tr>
                              <th scope="row">{index + 1}</th>
                              <td>{activity.name}</td>
                              <td>{activity.severity}</td>
                              <td>{activity.perActivityTime} seconds</td>
                              <td>{activity.total}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <h6>
                        <b>Starting Date: </b>
                        {activity.startDate}
                      </h6>
                    </div>
                    <div className="row">
                      <div className="col-8">
                        {activity.note ? (
                          <>
                            <b className="d-block">Special Instruction</b>
                            {activity.note}
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

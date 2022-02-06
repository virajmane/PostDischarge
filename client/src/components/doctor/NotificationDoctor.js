import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function NotificationDoctor(props) {
  let navigate = useNavigate();
  const [profile, setProfile] = useState([]);
  const [prescription, setPrescription] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
    if (localStorage.getItem("role") === "patient") {
      navigate("*");
    }
    getUser();
    getPrescription();
    // eslint-disable-next-line
  }, []);

  // Separate function to get user details

  async function getUser() {
    const response = await fetch(
      `http://localhost:5000/api/calendar/fetchallnoti`,
      {
        method: "GET",
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    const data = await response.json();
    setProfile(data);
  }
  async function getPrescription() {
    const response = await fetch(
      `http://localhost:5000/api/prescription/fetchRefillprescriptiondoctor`,
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

  async function handleAddEvent(title, start, createdBy, notiId, createdById) {
    try {
      //call api for creating calendarevent
      const response = await fetch(
        `http://localhost:5000/api/calendar/addevent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({
            title,
            start,
            createdBy,
            notiId,
            createdById,
          }),
        }
      );
      await response.json({ title, start, createdBy });
      props.showAlert(
        "Appointment Request Has been Accepted Succesfully",
        "success"
      );
      //call api for deleting event
      await fetch(`http://localhost:5000/api/calendar/deleteevent/${notiId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });

      const newNoti = profile.filter((notify) => {
        return notify._id !== notiId;
      });
      setProfile(newNoti);
    } catch (error) {
      return error;
    }
  }

  async function handleReject(notiId) {
    try {
      await fetch(`http://localhost:5000/api/calendar/deleteevent/${notiId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });

      const newNoti = profile.filter((notify) => {
        return notify._id !== notiId;
      });
      props.showAlert(
        "Appointment Request Has been Rejected Succesfully",
        "danger"
      );
      setProfile(newNoti);
    } catch (error) {
      return error;
    }
  }

  return (
    <div className="container">
      <div className="col-12 mt-5 ">
        <h2>Appointment Requests</h2>
        <div className="row">
          <h5 >
            {profile.length === 0 && "No Appointment Requests Yet"}
          </h5>
          {profile.map((profile, index) => (
            <div className="col-4 mb-xl-5 mb-7 mb-sm-6 mb-md-6 mb-lg-6 d-flex">
              <div className="card" style={{ width: "18rem" }}>
                <div className="card-body">
                  <h4>Appointment for {profile.title}</h4>
                  <p
                    className="card-text"
                    style={{ fontSize: "14px", marginBottom: "0.2rem" }}
                  >
                    <b>Date :</b> {profile.start.substring(0, 10)}
                  </p>
                  <p
                    className="card-text"
                    style={{ fontSize: "14px", marginBottom: "1rem" }}
                  >
                    <b>Requested By :</b> {profile.createdBy}
                  </p>

                  <button
                    className="btn btn-success mx-2"
                    onClick={() => {
                      handleAddEvent(
                        profile.title,
                        profile.start,
                        profile.createdBy,
                        profile._id,
                        profile.createdById
                      );
                    }}
                  >
                    Accept
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      handleReject(profile._id);
                    }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="col-12 mt-5 ">
        <h2>Precription Refill Requests</h2>
        <div className="row">
          <h5 className="mt-3">
            {prescription.length === 0 && "No Refill Requests Yet"}
          </h5>
          {prescription.map((prescription, index) => (
            <div className="col-4 mb-xl-5 mb-7 mb-sm-6 mb-md-6 mb-lg-6 d-flex">
              <div className="card" style={{ width: "18rem" }}>
                <div className="card-body">
                  <h5>Refill Request with the following medicines:</h5>
                  
                  <p
                    className="card-text"
                    style={{ fontSize: "14px", marginBottom: "0.3rem" }}
                  >
                    {prescription.medicines.map((med, index) => (
                      <>
                        <b>Medicine {index+1} : </b>
                        {med.name}
                      </>
                    ))}
                  </p>
                  <p
                    className="card-text"
                    style={{ fontSize: "14px", marginBottom: "1rem" }}
                  >
                    <b>Prescription Created: </b> {prescription.startDate}
                  </p>
                  <Link
                  type="button"
                    className="btn btn-primary"
                    to={`/viewProfilePatient/${prescription.patient}`}
                  >
                    View Patient Profile &nbsp;
                    <i className="fas fa-greater-than"></i>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

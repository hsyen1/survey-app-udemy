import axios from "axios";
import { FETCH_USER } from "./types";

/* 
this syntax is equivalent to the one below - a function within a function
export const fetchUser = () =>
  async function (dispatch) {
    const res = await axios.get("/api/current_user");

    dispatch({ type: FETCH_USER, payload: res });
  }; */

export const fetchUser = () => async dispatch => {
  const res = await axios.get("/api/current_user");

  dispatch({ type: FETCH_USER, payload: res.data });
};

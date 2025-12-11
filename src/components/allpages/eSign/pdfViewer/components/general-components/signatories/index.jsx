


import  { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetAllUserApi } from "../../../../../../../store/usermanagement/action";
// import "./index.css";

const Signatories = () => {
  const dispatch = useDispatch();
  const { getalluser, loading, error } = useSelector((state) => state.getalluser);

  useEffect(() => {
    dispatch(GetAllUserApi());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Filter users who have a UserSiganture
  const usersWithSignature = getalluser?.data?.filter(user => user.UserSiganture);

  // If no users with signature, we can show a message or just omit
  if (!usersWithSignature || usersWithSignature.length === 0) {
    return <div>No signatories found.</div>;
  }

  return (
    <div className="signatories-section" style={{ marginTop: "40px" }}>
      {/* Heading with Count */}
      {/* <h2>
        Signatories ({usersWithSignature.length})
      </h2> */}
      
      {/* List of Signatories */}
      {/* <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {usersWithSignature.map((user) => (
          <div key={user.UserID} className="signatory" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ fontWeight: "bold" }}>{user.UserFirstName}</div>
            {user.UserSiganture ? (
              <img
                src={user.UserSiganture}
                alt={`${user.UserFirstName}'s Signature`}
                style={{ width: "150px", height: "50px", objectFit: "contain", marginTop: "10px" }}
              />
            ) : (
              <div>No signature available</div>
            )}
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default Signatories;

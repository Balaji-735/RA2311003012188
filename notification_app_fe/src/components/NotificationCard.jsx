const getStatus = (notification, index, page) => {
  if (notification.Seen === false || notification.seen === false) {
    return "New";
  }

  if (notification.Seen === true || notification.seen === true) {
    return "Seen";
  }

  return index < 2 && page === 1 ? "New" : "Seen";
};

const NotificationCard = ({ notification, index, page }) => {
  const status = getStatus(notification, index, page);
  const typeClass = notification.Type ? notification.Type.toLowerCase() : "";

  return (
    <article className={status === "New" ? "notification-card new" : "notification-card"}>
      <div className="card-topline">
        <span className={`type-pill ${typeClass}`}>{notification.Type || "General"}</span>
        <span className={status === "New" ? "status-pill new" : "status-pill"}>{status}</span>
      </div>

      <h2>{notification.Message || "No message available"}</h2>
      <time dateTime={notification.Timestamp}>
        {notification.Timestamp ? new Date(notification.Timestamp).toLocaleString() : "No timestamp"}
      </time>
    </article>
  );
};

export default NotificationCard;

import { useEffect, useMemo, useState } from "react";
import { getToken } from "../api/auth";
import { getNotifications } from "../api/notifications";
import FilterBar from "../components/FilterBar";
import NotificationCard from "../components/NotificationCard";
import Pagination from "../components/Pagination";
import { Log } from "../logging_middleware/logger";
import { getTopNotifications } from "../utils/priority";

const itemsPerPage = 5;

const getNotificationList = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.notifications)) {
    return data.notifications;
  }

  if (Array.isArray(data?.Notifications)) {
    return data.Notifications;
  }

  if (Array.isArray(data?.data?.notifications)) {
    return data.data.notifications;
  }

  if (Array.isArray(data?.data?.Notifications)) {
    return data.data.Notifications;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
};

const normalizeNotification = (notification) => ({
  ID: notification.ID || notification.id || notification.Id,
  Type: notification.Type || notification.type || notification.category,
  Message: notification.Message || notification.message || notification.title || notification.body,
  Timestamp: notification.Timestamp || notification.timestamp || notification.createdAt || notification.time,
  Seen: notification.Seen ?? notification.seen,
});

const Dashboard = () => {
  const [token, setToken] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [topNotifications, setTopNotifications] = useState([]);
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const accessToken = await getToken();
        setToken(accessToken);
        await Log("frontend", "info", "component", "Dashboard mounted");

        const data = await getNotifications(accessToken, 10, 1);
        const list = getNotificationList(data).map(normalizeNotification);
        const prioritizedList = getTopNotifications(list, 10);

        setNotifications(list);
        setTopNotifications(prioritizedList);
        await Log("frontend", "info", "state", "Notification state updated");
      } catch (err) {
        setError("Unable to load notifications. Please check the Network tab for the API response.");
        await Log("frontend", "error", "page", "Dashboard failed to load notifications");
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const filteredNotifications = useMemo(() => {
    if (filter === "All") {
      return notifications;
    }

    return notifications.filter((notification) => notification.Type === filter);
  }, [filter, notifications]);

  const totalPages = Math.max(1, Math.ceil(filteredNotifications.length / itemsPerPage));
  const currentNotifications = filteredNotifications.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleFilterChange = async (nextFilter) => {
    setFilter(nextFilter);
    setPage(1);
    await Log("frontend", "info", "state", `Filter changed to ${nextFilter}`);

    if (token) {
      const type = nextFilter === "All" ? "" : nextFilter;
      await getNotifications(token, 10, 1, type);
    }
  };

  const handlePageChange = async (nextPage) => {
    setPage(nextPage);
    await Log("frontend", "info", "state", `Pagination changed to page ${nextPage}`);
  };

  return (
    <main className="app-shell">
      <section className="notification-panel">
        <div className="page-heading">
          <div>
            <p className="eyebrow">Notification Center</p>
            <h1>Campus Notifications</h1>
          </div>
          <div className="count-box">
            <span>{filteredNotifications.length}</span>
            <p>items</p>
          </div>
        </div>

        <FilterBar activeFilter={filter} onFilterChange={handleFilterChange} />

        {loading && <p className="state-message">Loading notifications...</p>}
        {error && <p className="state-message error">{error}</p>}

        {!loading && !error && currentNotifications.length === 0 && (
          <p className="state-message">No notifications found.</p>
        )}

        <div className="notification-list">
          {currentNotifications.map((notification, index) => (
            <NotificationCard
              index={index}
              key={notification.ID || `${notification.Type}-${notification.Timestamp}-${index}`}
              notification={notification}
              page={page}
            />
          ))}
        </div>

        <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />

        {topNotifications.length > 0 && (
          <section className="top-section">
            <h2>Top Priority Notifications</h2>
            <ol>
              {topNotifications.map((notification, index) => (
                <li key={notification.ID || `${notification.Type}-top-${index}`}>
                  <strong>{notification.Type}</strong>
                  <span>{notification.Message}</span>
                </li>
              ))}
            </ol>
          </section>
        )}
      </section>
    </main>
  );
};

export default Dashboard;

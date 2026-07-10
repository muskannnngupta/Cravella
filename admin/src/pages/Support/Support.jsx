import { useState, useEffect } from "react";
import axios from "axios";
import "./Support.css";

const Support = ({ url }) => {
  const [tickets, setTickets] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [activeTicket, setActiveTicket] = useState(null);

  const fetchTickets = async () => {
    try {
      const response = await axios.get(url + "/api/support/list");
      if (response.data.success) {
        setTickets(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [url]);

  const handleReplySubmit = async (ticketId) => {
    if (!replyText) {
      alert("Please enter a reply message");
      return;
    }

    try {
      const response = await axios.post(url + "/api/support/reply", {
        ticketId,
        reply: replyText
      });

      if (response.data.success) {
        alert("Reply sent successfully");
        setReplyText("");
        setActiveTicket(null);
        fetchTickets();
      } else {
        alert("Failed to send reply");
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      alert("Error sending reply");
    }
  };

  return (
    <div className="support-admin">
      <h3>Customer Support Tickets</h3>
      <div className="ticket-list">
        {tickets.map((ticket, index) => (
          <div key={index} className="ticket-card">
            <div className="ticket-header">
              <div>
                <strong>{ticket.userName}</strong> ({ticket.userEmail})
              </div>
              <span className={`status-badge ${ticket.status.toLowerCase()}`}>
                {ticket.status}
              </span>
            </div>
            <div className="ticket-body">
              <p><strong>Subject:</strong> {ticket.subject}</p>
              {ticket.orderId && <p><strong>Order ID:</strong> {ticket.orderId}</p>}
              <p><strong>Message:</strong> {ticket.message}</p>
              
              {ticket.reply && (
                <div className="admin-reply">
                  <strong>Your Reply:</strong> {ticket.reply}
                </div>
              )}
            </div>
            
            {!ticket.reply && (
              <div className="ticket-actions">
                {activeTicket === ticket._id ? (
                  <div className="reply-form">
                    <textarea 
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply to the customer..."
                      rows="3"
                    ></textarea>
                    <div className="reply-buttons">
                      <button className="btn-send" onClick={() => handleReplySubmit(ticket._id)}>Send Reply</button>
                      <button className="btn-cancel" onClick={() => {setActiveTicket(null); setReplyText("");}}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button className="btn-reply" onClick={() => setActiveTicket(ticket._id)}>Reply to Ticket</button>
                )}
              </div>
            )}
          </div>
        ))}
        {tickets.length === 0 && <p>No support tickets available.</p>}
      </div>
    </div>
  );
};

export default Support;

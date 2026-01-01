import React from 'react';

function LinkCard({ title, links }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <ul>
        {links.map((link, index) => (
          <li key={index}>
            <a href={link.href}>{link.text}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LinkCard;

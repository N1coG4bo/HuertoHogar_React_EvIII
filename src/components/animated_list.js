// Animated list wrapper inspired by ReactBits.
import React from 'react';

function AnimatedList({ items, className = '', ...rest }) {
  return (
    <ul className={`animated-list ${className}`.trim()} {...rest}>
      {items.map((item, index) => (
        <li
          key={item.key}
          className="animated-list-item"
          style={{ '--delay': `${index * 70}ms` }}
        >
          {item.node}
        </li>
      ))}
    </ul>
  );
}

export default AnimatedList;

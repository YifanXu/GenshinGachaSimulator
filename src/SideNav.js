import React from 'react'
import './SideNav.css'

const SideNav = (props) => {
  let itemLinks = [];
  for (let [item, itemLink] of Object.entries(props.items)) {
    itemLinks.push(
      <div key={item} className="sideNavItem">
        <a href={itemLink}>{item}</a>
      </div>
    );
  }

  return (
    <div id="sideNav">{itemLinks}</div>
  )
}

export default SideNav
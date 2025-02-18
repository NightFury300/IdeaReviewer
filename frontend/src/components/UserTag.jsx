import React from 'react'

function UserTag({username}) {
  return (
    <div className="flex items-center mb-2">
        <span className="font-semibold text-blue-200 mr-2">@{username}</span>
      </div>
  )
}

export default UserTag
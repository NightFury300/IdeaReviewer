import React from 'react'
import {User} from "lucide-react"

function UserTag({username}) {
  return (
    <div className="flex items-center space-x-2 text-gray-600 mb-2">
          <User size={20} />
          <span className="text-sm font-medium">{username || 'Anonymous'}</span>
        </div>
  )
}

export default UserTag
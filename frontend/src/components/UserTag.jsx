import React from 'react'
import {AtSign} from "lucide-react"

function UserTag({username}) {
  return (
    <div className="flex items-center space-x-0.5 text-gray-600 mb-2">
      <AtSign size={18} />
      <span className="text-sm font-bold">{username || 'Anonymous'}</span>
    </div>
  )
}

export default UserTag
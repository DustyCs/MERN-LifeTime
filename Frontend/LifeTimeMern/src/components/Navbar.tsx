import React from 'react'
import "../css/styles.css"
import { Links }from '../data/links'

export default function Navbar() {
    return (
      <nav className='w-64 bg-[#f54257] text-white min-h-screen p-4'>
        <div className='text-5xl font-bold mb-4'>LifeTime</div>
        <div className='flex flex-col space-y-2'>
            {Links.map((link) => (
                <a key={link.name} href={link.path} className='px-4 py-2 rounded text-2xl
                                                             hover:text-black hover:bg-[#f1f1f1] transition duration-300'>{link.name}</a>
            ))}
        </div>
      </nav>
    );
  }
  
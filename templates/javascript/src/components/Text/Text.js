import { useState } from 'react'
import { Button } from 'reactstrap'
import './Text.scoped.css'

export default function Text () {
  const [count, setCount] = useState(0)
  return (
    <>
      <h1 className='text-primary'>Welcome to your React plugin</h1>
      <p className='text'>Here  is some scoped CSS,  You'll find it pretty useful for your plugin.</p>
      <p>Bootstrap is scoped to the plugin, dont worry about affectin your theme!</p>
      <Button color='info' onClick={() => setCount(count + 1)}>Count up!</Button>
      <h4 className='mt-3'>{count}</h4>
    </>
  )
}

import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Page from '../app/page'
 
describe('Page', () => {
  it('renders a heading', async () => {
    render(<Page />)
    expect(await screen.findByText('Hello world')).toBeVisible()
  })
})
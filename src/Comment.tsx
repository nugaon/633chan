import { ReactElement } from 'react'

interface Props {
  comment: string
}

export default function Comment({ comment }: Props): ReactElement {
  return (
    <div className="633chan-comment">
      <div className="633chan-comment-name">BeeTard</div>
      <div className="633chan-comment-date">1956.10.23</div>
      <div className="633chan-comment-content">{comment}</div>
    </div>
  )
}

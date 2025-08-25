import * as React from 'react';
import * as Label from '@radix-ui/react-label';


function StarRating({ rating, onRate }) {
	return (
		<div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
			{[1, 2, 3, 4, 5].map((num) => (
				<button
					key={num}
					type="button"
					aria-label={`Rate ${num} star${num > 1 ? 's' : ''}`}
					className={`star-rating-star${num <= rating ? ' filled' : ''}`}
					onClick={() => onRate(num)}
					onKeyDown={e => {
						if (e.key === 'Enter' || e.key === ' ') onRate(num);
					}}
				>
					{'★'}
				</button>
			))}
		</div>
	);
}

export default StarRating;
// import React from 'react';
// import './StarRating.css';

// // Accessible star rating component
// function StarRating({ rating, onRate }) {
// 	return (
// 		<div className="star-rating-root">
// 			{[1, 2, 3, 4, 5].map((num) => (
// 				<button
// 					key={num}
// 					type="button"
// 					aria-label={`Rate ${num} star${num > 1 ? 's' : ''}`}
// 					className={`star-rating-star${num <= rating ? ' filled' : ''}`}
// 					onClick={() => onRate(num)}
// 					onKeyDown={e => {
// 						if (e.key === 'Enter' || e.key === ' ') onRate(num);
// 					}}
// 				>
// 					{'\u2605'}
// 				</button>
// 			))}
// 		</div>
// 	);
// }

// export default StarRating;

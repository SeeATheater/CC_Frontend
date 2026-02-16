import { useState } from 'react';
import Calendar from 'react-calendar';
import styled from 'styled-components';
import 'react-calendar/dist/Calendar.css';
import { useEffect } from 'react';
function MyCalendar({ setDate }) {
	const [value, onChange] = useState(new Date());

	useEffect(() => {
		setDate(value);
	}, [value]);
	const today = new Date();
	const oneYearLater = new Date(today);
	oneYearLater.setFullYear(today.getFullYear() + 1);

	return (
		<StyledCalendarWrapper>
			<Calendar
				onChange={onChange}
				value={value}
				prev2Label={null}
				next2Label={null}
				formatDay={(locale, date) =>
					date.toLocaleString('en', { day: 'numeric' })
				}
				minDate={today}
				maxDate={oneYearLater}
				minDetail="year"
			/>
		</StyledCalendarWrapper>
	);
}

export default MyCalendar;

export const StyledCalendarWrapper = styled.div`
	.react-calendar {
		max-width: 350px;
		height: 300px;
		background: white;
		border: none;
		line-height: 1.125em;
	}

	.react-calendar--doubleView {
		width: 700px;
	}

	.react-calendar--doubleView .react-calendar__viewContainer {
		display: flex;
		margin: -0.5em;
	}

	.react-calendar--doubleView .react-calendar__viewContainer > * {
		width: 50%;
		margin: 0.5em;
	}

	.react-calendar,
	.react-calendar *,
	.react-calendar *:before,
	.react-calendar *:after {
		-moz-box-sizing: border-box;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
	}

	.react-calendar button {
		margin: 0;
		border: 0;
		outline: transparent;
	}

	.react-calendar button:enabled:hover {
		cursor: pointer;
	}

	.react-calendar__navigation {
		display: flex;
		height: 44px;
		margin-bottom: 1em;
	}

	.react-calendar__navigation button {
		min-width: 44px;
		background: transparent;
	}

	.react-calendar__navigation button:disabled {
		background-color: transparent;
	}

	.react-calendar__navigation button:enabled:hover,
	.react-calendar__navigation button:enabled:focus {
		background-color: transparent;
	}

	.react-calendar__month-view__weekdays {
		text-align: center;
		text-transform: uppercase;
		font: inherit;
		font-size: 0.75em;
		font-weight: bold;
	}

	.react-calendar__month-view__weekdays__weekday {
		padding: 0.5em;
		color: var(--color-gray-maintext, #000);
		font-size: 12px;
		font-style: normal;
		font-weight: 500;
		line-height: normal;
	}

	.react-calendar__month-view__weekNumbers .react-calendar__tile {
		display: flex;
		align-items: center;
		justify-content: center;
		font: inherit;
		font-size: 0.75em;
		font-weight: bold;
	}

	.react-calendar__month-view__days__day--weekend {
		color: ${({ theme }) => theme.colors.grayMain};
	}

	.react-calendar__month-view__days__day--neighboringMonth,
	.react-calendar__decade-view__years__year--neighboringDecade,
	.react-calendar__century-view__decades__decade--neighboringCentury {
		color: ${({ theme }) => theme.colors.gray400};
	}

	.react-calendar__tile {
		background: transparent;
		text-align: center;
		color: #000;
		font-size: 16px;
		font-style: normal;
		font-weight: 500;
		line-height: normal;
		
	}

	.react-calendar__tile:disabled {
		background-color: transparent;
		color: #ababab;
	}

	.react-calendar__month-view__days__day--neighboringMonth:disabled,
	.react-calendar__decade-view__years__year--neighboringDecade:disabled,
	.react-calendar__century-view__decades__decade--neighboringCentury:disabled {
		color: transparent;
	}

	.react-calendar__tile:enabled:hover,
	.react-calendar__tile:enabled:focus {
		background-color: transparent;
	}

	.react-calendar__tile--now {
		background: transparent;
	}

	.react-calendar__tile--now:enabled:hover,
	.react-calendar__tile--now:enabled:focus {
		background: transparent;
	}

	.react-calendar__tile--hasActive {
		background: transparent;
	}

	.react-calendar__tile--hasActive:enabled:hover,
	.react-calendar__tile--hasActive:enabled:focus {
		background: transparent;
	}

	.react-calendar--selectRange .react-calendar__tile--hover {
		background-color: transparent;
	}
	.react-calendar__tile--active:enabled:hover,
	.react-calendar__tile--active:enabled:focus {
		background: ${({ theme }) => theme.colors.pink600};
	}
	.react-calendar__tile--active {
		background: ${({ theme }) => theme.colors.pink600};
		color: white;
	}
	.react-calendar__navigation__label__labelText {
		color: var(--color-gray-maintext, #000);
		font-size: 16px;
		font-style: normal;
		font-weight: 600;
		line-height: normal;
	}
	.react-calendar__month-view__days__day--neighboringMonth {
		color: #ddd;
	}
		.react-calendar__year-view__months__month {
		padding: 20px 30px;
		}
`;

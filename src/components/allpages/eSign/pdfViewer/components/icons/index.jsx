import React from 'react';

const iconsTypeMap = {
  stamp: ({ color }) => (
    <svg
      width='25'
      height='24'
      viewBox='0 0 25 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M5.5 22H19.5'
        stroke={color || '#4F46E5'}
        stroke-width='2'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <path
        d='M19.77 13.73C19.5374 13.498 19.2614 13.3141 18.9577 13.1888C18.6539 13.0636 18.3285 12.9994 18 13H7C6.33696 13 5.70107 13.2634 5.23223 13.7322C4.76339 14.2011 4.5 14.837 4.5 15.5V17C4.5 17.2652 4.60536 17.5196 4.79289 17.7071C4.98043 17.8946 5.23478 18 5.5 18H19.5C19.7652 18 20.0196 17.8946 20.2071 17.7071C20.3946 17.5196 20.5 17.2652 20.5 17V15.5C20.5 14.84 20.24 14.2 19.77 13.73Z'
        stroke={color || '#4F46E5'}
        stroke-width='2'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <path
        d='M14.5 13V8.5C14.5 7 15.5 7 15.5 5C15.5 4.20435 15.1839 3.44129 14.6213 2.87868C14.0587 2.31607 13.2956 2 12.5 2C10.84 2 9.5 3 9.5 5C9.5 7 10.5 7 10.5 8.5V13'
        stroke={color || '#4F46E5'}
        stroke-width='2'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
    </svg>
  ),
  signature: ({ color }) => (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M17 3.00015C17.2547 2.69918 17.5697 2.45421 17.925 2.28083C18.2803 2.10745 18.6681 2.00948 19.0636 1.99316C19.4592 1.97684 19.8538 2.04253 20.2224 2.18604C20.5909 2.32954 20.9254 2.54772 21.2043 2.82667C21.4833 3.10562 21.7006 3.43921 21.8425 3.80619C21.9845 4.17317 22.0478 4.56548 22.0286 4.95813C22.0094 5.35077 21.908 5.73513 21.7309 6.08671C21.5538 6.43829 21.3049 6.74938 21 7.00015L7.5 20.5001L2 22.0001L3.5 16.5001L17 3.00015Z'
        stroke={color || '#4F46E5'}
        stroke-width='2'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <path
        d='M15 5L19 9'
        stroke={color || '#4F46E5'}
        stroke-width='2'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
    </svg>
  ),
  date: ({ color }) => (
    <svg
      width='25'
      height='24'
      viewBox='0 0 25 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M8.5 2V6'
        stroke='#4F46E5'
        stroke-width='2'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <path
        d='M16.5 2V6'
        stroke={color || '#4F46E5'}
        stroke-width='2'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <path
        d='M19.5 4H5.5C4.39543 4 3.5 4.89543 3.5 6V20C3.5 21.1046 4.39543 22 5.5 22H19.5C20.6046 22 21.5 21.1046 21.5 20V6C21.5 4.89543 20.6046 4 19.5 4Z'
        stroke={color || '#4F46E5'}
        stroke-width='2'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <path
        d='M3.5 10H21.5'
        stroke={color || '#4F46E5'}
        stroke-width='2'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
    </svg>
  ),
  initials: ({ color }) => (
    <svg
      width='25'
      height='24'
      viewBox='0 0 25 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M4.5 7V4H20.5V7'
        stroke={color || '#4F46E5'}
        stroke-width='2'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <path
        d='M9.5 20H15.5'
        stroke={color || '#4F46E5'}
        stroke-width='2'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <path
        d='M12.5 4V20'
        stroke={color || '#4F46E5'}
        stroke-width='2'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
    </svg>
  ),
};

const Icons = ({ type, color }) => {
  const Icon = iconsTypeMap[type];
  return <Icon color={color} />;
};

export default Icons;

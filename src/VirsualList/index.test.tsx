import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import VirsualList from './index';

const { useState, useEffect } = React

// describe('<VirsualList />', () => {
//   it('render VirsualList with like', () => {
//     let data = Array(50).fill(0).map((v, i) => i + 1)
//     function App() {
//       const [totalList, setTotalList] = useState([])
//       useEffect(() => {
//         setTotalList([])
//       }, [])
//       return <div>
//         <VirsualList data={totalList} initPageCount={5} autoAdjustPageCount={true} height='500px'>
//           {item => <p key={item}>{item}</p>}
//         </VirsualList>
//         <button onClick={() => setTotalList([...totalList, 666, 7777, 8888])}>添加数据</button>
//       </div>
//     }

//     render(<App />);
//     expect(screen.queryByText(msg)).toBeInTheDocument();
//   });
// });

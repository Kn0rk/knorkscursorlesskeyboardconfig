// import { createDecoration } from "./createDecorations";
// import { splitDocument } from "./splitDocument";


// test('myFunction returns the correct result', () => {

//     const text = `
//     let match;
//     while (match = regEx.exec(text)){
//         let sen = text.slice(match.index,match.length);
  
//     }
//     `;
//     let candidates = splitDocument(text);
//     let res = createDecoration(text,candidates);
//     expect(res).toBe([
//         {
//           style: "solid",
//           character: "l",
//           startOffset: 5,
//           endOffset: 8,
//           word: "let",
//         },
//         {
//           style: "solid",
//           character: "h",
//           startOffset: 20,
//           endOffset: 25,
//           word: "while",
//         },
//         {
//           style: "solid",
//           character: "t",
//           startOffset: 62,
//           endOffset: 65,
//           word: "let",
//         },
//       ]);
//   });
  
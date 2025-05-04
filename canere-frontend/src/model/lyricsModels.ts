export type Verse = {
    index: number;
    startTime: number;
    endTime: number;
    text: string;
    words: Word[];
  };
  
  export type Word = {
    word: string;
    startTime: number;
    endTime: number;
  };
  
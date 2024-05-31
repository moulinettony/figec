declare module 'formidable' {
    import { IncomingMessage } from 'http';
    import { EventEmitter } from 'events';
    import { Stream } from 'stream';
  
    interface Fields {
      [key: string]: string | string[];
    }
  
    interface File {
      originalFilename: string;
      filepath: any;
      size: number;
      path: string;
      name: string;
      type: string;
      hash?: string;
      lastModifiedDate?: Date;
    }
  
    interface Files {
      [key: string]: File | File[];
    }
  
    interface Options {
      encoding?: string;
      uploadDir?: string;
      keepExtensions?: boolean;
      maxFileSize?: number;
      maxFieldsSize?: number;
      maxFields?: number;
      hash?: string | boolean;
      multiples?: boolean;
    }
  
    export class IncomingForm extends EventEmitter {
      constructor(options?: Options);
      parse(req: IncomingMessage, callback?: (err: any, fields: Fields, files: Files) => void): void;
      onPart(part: Stream): void;
    }
  }
  
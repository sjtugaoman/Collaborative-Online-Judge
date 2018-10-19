import { Injectable } from '@angular/core';

declare var io: any;

@Injectable()

export class CollaborationService {
  collaborationSocket: any;

  constructor() { }

  init(editor: any, sessionId: string): void {
    //this.collaborationSocket = io(window.location.origin, { query: 'message=haha' });
    this.collaborationSocket = io(window.location.origin, {query: 'sessionId =' + sessionId});
    // this.collaborationSocket.on("message", (message) => {
    //   console.log('message received from the server: ' + message);
    // });
    this.collaborationSocket.on("change", (delta: string) => {
      console.log('collaboration: editor changes by ' + delta);
      delta = JSON.parse(delta);
      editor.lastAppliedChange = delta;
      editor.getSession().getDocument().applyDeltas([delta]);
  });
  }

  //emit event to make changes and inform server also other collaborators
  change(delta: string): void{
    this.collaborationSocket.emit("change", delta);
  }

  // send restore buffer request to server
  restoreBuffer(): void {
    this.collaborationSocket.emit("restoreBuffer");
}
}

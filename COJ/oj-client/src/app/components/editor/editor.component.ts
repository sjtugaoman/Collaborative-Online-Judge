import { Component, OnInit } from '@angular/core';
import { CollaborationService } from '../../services/collaboration.service';
import { ActivatedRoute, Params } from '@angular/router';
import { DataService } from '../../services/data.service';

declare var ace: any;
@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  editor: any;
  output: string = '';

  public languages: string[] = ['Java', 'Python'];
  language: string = 'Java';
  sessionId: string;

  constructor(private collaboration: CollaborationService,
              private route: ActivatedRoute,
              private dataService: DataService) { }

  defaultContent = {
    'Java': `public class Example {
      public staic void main(String[] args) {
        //Type your Java code here.
      }
    }`,
    'Python':  `class Solution:
      def example():
        # Write your python code here.
    `
  };

  ngOnInit() {

    //Get the session id(problem id)
    this.route.params
      .subscribe(params => {
        this.sessionId = params['id'];
        this.initEditor();
        this.collaboration.restoreBuffer();
      });


  }

  initEditor(): void{
    this.editor = ace.edit("editor");
    this.editor.setTheme("ace/theme/eclipse");
    this.resetEditor();
    //set collaboration socket
    this.collaboration.init(this.editor, this.sessionId);
    this.editor.lastAppliedChange = null;

    //register change callback
    this.editor.on("change", (e) => {
    console.log('editor changes:' + JSON.stringify(e));
    if(this.editor.lastAppliedChange != e) {
      this.collaboration.change(JSON.stringify(e));
    }
  })

  }
  setLanguage(language: string): void {
    this.language = language;
    this.resetEditor();
  }
  resetEditor(): void {
    this.editor.setValue(this.defaultContent[this.language]);
    this.editor.session.setMode("ace/mode/" + this.language.toLowerCase());
  }

  submit(): void {
    let user_code =  this.editor.getValue();
    console.log(user_code);

    const data = {
      user_code: user_code,
      lang: this.language.toLocaleLowerCase()
    };

    this.dataService.buildAndRun(data)
      .then(res => this.output = res.text);
  }
}

/// <reference path="jquery.ts" />



/// <reference path="memon.ts" />
/// <reference path="memon/note.ts" />

/// <reference path="note-viewer/note-viewer.ts" />

// initial work
(function(){
    Memon.Note.loadMyNoteList(function(success: bool, notes: NoteData[]){
        if (success) {
            window.console.log(notes);

            var area: JQuery = jQuery("#note-viewer");
            var rowOrign: JQuery = jQuery("<div class='row'></div>");
            var row: JQuery;

            for (var i = 0; i < notes.length; i++) {
                if ( i % 3 === 0 ) {
                    row = rowOrign.clone();
                    area.append(row);
                }

                var note_view: NoteViewer = new NoteViewer(notes[i]);
                row.append( note_view.getJQuery("span4") );
            }
        } else {


            window.alert("エラーが発生しました。");
        }
    });
})();
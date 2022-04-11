package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
)

// open a connection (create the server)
// listen to incoming POST requests on a given route
// create a temp file
// save data (bytes) into the file

func HandleUpload(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(32 << 20)

	file, handler, err := r.FormFile("uploadImg")
	if err != nil {
		fmt.Println("Error Retrieving the File")
		log.Fatal(err)
		return
	}
	defer file.Close()

	// print the request header
	fmt.Fprintf(w, "%v\n", handler.Header)

	saveFile, err := os.OpenFile("./uploads/"+handler.Filename, os.O_WRONLY|os.O_CREATE, 0666)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer saveFile.Close()
	io.Copy(saveFile, file)

	fileName, fileSize := handler.Filename, handler.Size

	fmt.Fprintf(w, "status: %d, filename: %s, filesize: %d", http.StatusAccepted, fileName, fileSize)

}

func main() {

	// start server
	http.HandleFunc("/upload", HandleUpload)
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}

}

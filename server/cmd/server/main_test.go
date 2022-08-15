// package main
//
// import (
// 	"bytes"
// 	"fmt"
// 	"io"
// 	"mime/multipart"
// 	"net/http"
// 	"net/http/httptest"
// 	"os"
// 	"testing"
// )
//
// func testmain(t *testing.t) {
//
// 	type testexpected struct {
// 		status int
// 		file   string
// 		size   int64
// 	}
//
// 	type testcase struct {
// 		filename string
// 		filepath string
// 		expect   testexpected
// 	}
// 	tests := map[string]testcase{
// 		"pngavatar": {
// 			filename: "test.png",
// 			filepath: "./test.png",
// 			expect: testexpected{
// 				status: http.statusaccepted,
// 				file:   "test.png",
// 				size:   int64(58502),
// 			},
// 		},
// 		"textfile": {
// 			filename: "test.txt",
// 			filepath: "./test.txt",
// 			expect: testexpected{
// 				status: http.statusaccepted,
// 				file:   "test.txt",
// 				size:   int64(0),
// 			},
// 		},
// 		"bigjpeg": {
// 			filename: "3.jpg",
// 			filepath: "./3.jpg",
// 			expect: testexpected{
// 				status: http.statusinternalservererror,
// 				file:   "",
// 				size:   int64(0),
// 			},
// 		},
// 	}
//
// 	for name, tc := range tests {
//
// 		body := new(bytes.buffer)
// 		// this writer is going to transform
// 		// what we pass to it to multipart form data
// 		// and write it to our io.pipe
// 		writer := multipart.newwriter(body)
//
// 		// this is the file we are going to upload
// 		file, err := os.open(tc.filepath)
// 		if err != nil {
// 			t.error(err)
// 		}
// 		defer file.close()
//
// 		// this is the file handler
// 		filewriter, err := writer.createformfile("uploadimg", tc.filepath)
// 		if err != nil {
// 			t.error(err)
// 		}
//
// 		// copy the file data to the file handler
// 		if _, err = io.copy(filewriter, file); err != nil {
// 			t.error(err)
// 		}
//
// 		// close the writer
// 		if err := writer.close(); err != nil {
// 			t.error(err)
// 		}
//
//
// 		router := setuprouter()
//
// 		// create a new request
// 		req, err := http.newrequest(http.methodpost, "/upload", body)
// 		if err != nil {
// 			t.error(err)
// 		}
//
// 		// set the content type
// 		req.header.add("content-type", writer.formdatacontenttype())
//
// 		// create a new recorder
// 		res := httptest.newrecorder()
//
// 		// serve the request
// 		router.servehttp(res, req)
//
// 		// check the status code
// 		if status := res.code; status != tc.expect.status {
// 			t.errorf("test case: %v - handler returned wrong status code: got %v want %v",
// 				name, status, tc.expect.status)
// 		}
//
// 		// check the response body
// 		expected := fmt.sprintf("filename: %s, filesize: %d", tc.expect.file, tc.expect.size)
// 		if res.body.string() != expected {
// 			t.errorf("test case: %v failed; got %v want %v",
// 				name, res.body.string(), expected)
// 		}
// 	}
//
// }
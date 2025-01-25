const autoBind = require('auto-bind');

class NotesHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    // this.postNoteHandler = this.postNoteHandler.bind(this);
    // this.getNotesHandler = this.getNotesHandler.bind(this);
    // this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
    // this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
    // this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);

    autoBind(this); // mem-bind nilai seluruh this
  }

  async postNoteHandler(request, h) {
    this._validator.validateNotePayload(request.payload);
    const { title = 'untitled', body, tags } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    // const noteId = await this._service.addNote({ title, body, tags });
    const noteId = await this._service.addNote({
      title, body, tags, owner: credentialId,
    });

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId,
      },
    });
    response.code(201);
    return response;
  }

  async getNotesHandler(request) {
    // const notes = await this._service.getNotes();
    const { id: credentialId } = request.auth.credentials;
    const notes = await this._service.getNotes(credentialId);
    return {
      status: 'success',
      data: {
        notes,
      },
    };
  }

  async getNoteByIdHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._service.verifyNoteAccess(id, credentialId); // -- pada kolaborasi
    // await this._service.verifyNoteOwner(id, credentialId);  -- pada autentikasi dan authorisasi
    const note = await this._service.getNoteById(id);
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }

  async putNoteByIdHandler(request, h) {
    this._validator.validateNotePayload(request.payload);
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._service.verifyNoteAccess(id, credentialId); // -- pada kolaborasi
    // await this._service.verifyNoteOwner(id, credentialId);  -- pada autentikasi dan authorisasi
    await this._service.editNoteById(id, request.payload);

    return {
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    };
  }

  async deleteNoteByIdHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._service.verifyNoteOwner(id, credentialId);
    await this._service.deleteNoteById(id);

    return {
      status: 'success',
      message: 'Catatan berhasil dihapus',
    };
  }
}

module.exports = NotesHandler;

// KODE HANDLER TANPA POSTGRES
// class NotesHandler {
//   constructor(service, validator) {
//     this._service = service;
//     this._validator = validator;

//     this.postNoteHandler = this.postNoteHandler.bind(this);
//     this.getNotesHandler = this.getNotesHandler.bind(this);
//     this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
//     this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
//     this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);
//   }

//   postNoteHandler(request, h) {
//     this._validator.validateNotePayload(request.payload);
//     const { title = 'untitled', body, tags } = request.payload;

//     const noteId = this._service.addNote({ title, body, tags });

//     const response = h.response({
//       status: 'success',
//       message: 'Catatan berhasil ditambahkan',
//       data: {
//         noteId,
//       },
//     });
//     response.code(201);
//     return response;
//   }

//   getNotesHandler() {
//     const notes = this._service.getNotes();
//     return {
//       status: 'success',
//       data: {
//         notes,
//       },
//     };
//   }

//   getNoteByIdHandler(request, h) {
//     const { id } = request.params;
//     const note = this._service.getNoteById(id);
//     return {
//       status: 'success',
//       data: {
//         note,
//       },
//     };
//   }

//   putNoteByIdHandler(request, h) {
//     this._validator.validateNotePayload(request.payload);
//     const { id } = request.params;

//     this._service.editNoteById(id, request.payload);

//     return {
//       status: 'success',
//       message: 'Catatan berhasil diperbarui',
//     };
//   }

//   deleteNoteByIdHandler(request, h) {
//     const { id } = request.params;
//     this._service.deleteNoteById(id);

//     return {
//       status: 'success',
//       message: 'Catatan berhasil dihapus',
//     };
//   }

// Kode Handle Error LAMA
// postNoteHandler(request, h) {
//   try {
//     this._validator.validateNotePayload(request.payload);
//     const { title = 'untitled', body, tags } = request.payload;
//     const noteId = this._service.addNote({ title, body, tags });
//     const response = h.response({
//       status: 'success',
//       message: 'Catatan berhasil ditambahkan',
//       data: {
//         noteId,
//       },
//     });
//     response.code(201);
//     return response;
//   } catch (error) {
//     if (error instanceof ClientError) {
//       const response = h.response({
//         status: 'fail',
//         message: error.message,
//       });
//       response.code(error.statusCode);
//       return response;
//     }

//     // Server ERROR!
//     const response = h.response({
//       status: 'error',
//       message: 'Maaf, terjadi kegagalan pada server kami.',
//     });
//     response.code(500);
//     console.error(error);
//     return response;
//   }
// }

// getNotesHandler() {
//   const notes = this._service.getNotes();
//   return {
//     status: 'success',
//     data: {
//       notes,
//     },
//   };
// }

// getNoteByIdHandler(request, h) {
//   try {
//     const { id } = request.params;
//     const note = this._service.getNoteById(id);
//     return {
//       status: 'success',
//       data: {
//         note,
//       },
//     };
//   } catch (error) {
//     if (error instanceof ClientError) {
//       const response = h.response({
//         status: 'fail',
//         message: error.message,
//       });
//       response.code(error.statusCode);
//       return response;
//     }

//     // Server ERROR!
//     const response = h.response({
//       status: 'error',
//       message: 'Maaf, terjadi kegagalan pada server kami.',
//     });
//     response.code(500);
//     console.error(error);
//     return response;
//   }
// }

// putNoteByIdHandler(request, h) {
//   try {
//     this._validator.validateNotePayload(request.payload);
//     const { id } = request.params;
//     this._service.editNoteById(id, request.payload);
//     return {
//       status: 'success',
//       message: 'Catatan berhasil diperbarui',
//     };
//   } catch (error) {
//     if (error instanceof ClientError) {
//       const response = h.response({
//         status: 'fail',
//         message: error.message,
//       });
//       response.code(error.statusCode);
//       return response;
//     }

//     // Server ERROR!
//     const response = h.response({
//       status: 'error',
//       message: 'Maaf, terjadi kegagalan pada server kami.',
//     });
//     response.code(500);
//     console.error(error);
//     return response;
//   }
// }

// deleteNoteByIdHandler(request, h) {
//   try {
//     const { id } = request.params;
//     this._service.deleteNoteById(id);
//     return {
//       status: 'success',
//       message: 'Catatan berhasil dihapus',
//     };
//   } catch (error) {
//     if (error instanceof ClientError) {
//       const response = h.response({
//         status: 'fail',
//         message: error.message,
//       });
//       response.code(error.statusCode);
//       return response;
//     }

//     // Server ERROR!
//     const response = h.response({
//       status: 'error',
//       message: 'Maaf, terjadi kegagalan pada server kami.',
//     });
//     response.code(500);
//     console.error(error);
//     return response;
//   }
// }
// }

// module.exports = NotesHandler;

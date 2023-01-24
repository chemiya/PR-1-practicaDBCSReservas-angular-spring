package com.uva.users.controlador;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.uva.users.excepcion.UsuarioExcepcion;
import com.uva.users.modelo.Usuario;
import com.uva.users.repository.UsuarioRepository;

@RestController
@RequestMapping("users")//ruta general
@CrossOrigin(origins = "*")//para cors
public class ControladorUsuario {
    //enlazo con el repositorio
    private final UsuarioRepository repository;

    ControladorUsuario(UsuarioRepository repository) {
        this.repository = repository;
    }

    // crear usuario
    @PostMapping//me llega en el body el nuevo usuario
    public String newUsuario(@RequestBody Usuario newUsuario) {
        try {
            repository.save(newUsuario);
            return "Nuevo usuario creado";
        } catch (Exception e) {

            return "no se ha podido crear el usuario";
        }
    }

    // obtener todos lo usuarios
    @GetMapping//devuelvo array de usuarios
    public List<Usuario> getUsuarios() {
        List<Usuario> usuarios = new ArrayList<Usuario>();

        repository.findAll().forEach(usuarioVisto -> usuarios.add(usuarioVisto));

        return usuarios;

    }

    
    @GetMapping("/tipo")//me llega ? el tipo
    public List<Usuario> getUsuariosEnabled(@RequestParam boolean enabled) {
        List<Usuario> usuarios = new ArrayList<Usuario>();

        repository.findByEnabled(enabled).forEach(usuarioVisto -> usuarios.add(usuarioVisto));
        return usuarios;

    }

    // obtener un usuario concreto
    @GetMapping(value = "/{id}")//me llega el id en la ruta
    public Usuario getUsuarioById(@PathVariable int id) {

        Usuario usuario;
        if (repository.existsById(id)) {
            usuario = repository.findById(id).get();
            return usuario;

        } else {
            // si no se encuntra devuelve null
            return null;
        }

    }

    // actualizar usuario
    @PutMapping(value = "/{id}")//me llega el id en la ruta y en el body el nuevo
    public String actualizarUsuarioById(@PathVariable int id, @RequestBody Usuario usuario) {
        if (repository.existsById(id)) {
            Usuario usuarioCorrespondiente = repository.findById(id).get();

            usuarioCorrespondiente.setCreatedAt(usuario.getCreatedAt());
            usuarioCorrespondiente.setUpdatedAt(usuario.getUpdatedAt());
            usuarioCorrespondiente.setEnabled(usuario.isEnabled());
            usuarioCorrespondiente.setEmail(usuario.getEmail());
            usuarioCorrespondiente.setPassword(usuario.getPassword());
            usuarioCorrespondiente.setRole(usuario.getRole());
            usuarioCorrespondiente.setFirstName(usuario.getFirstName());
            usuarioCorrespondiente.setLastName(usuario.getLastName());
            usuarioCorrespondiente.setUsername(usuario.getUsername());

            repository.save(usuarioCorrespondiente);
            return "actualizado correctamente";
        } else {
            return "no existe ese usuario";
        }

    }

    // obtener usuario por nombre similar
    @GetMapping("/buscarNombre/{nombre}")//me llega el nombre
    public Usuario buscarNombre(@PathVariable String nombre) {
        List<Usuario> usuarios = new ArrayList<Usuario>();
        usuarios = repository.findByName(nombre);
        if (usuarios.isEmpty()) {
            return null;
        } else {
            return usuarios.get(0);
        }

    }

    //identificacion por usuario y contrasena

    @GetMapping("/identificacion/{nombre}/{contrasena}")
    public Usuario identificacion(@PathVariable String nombre,@PathVariable String contrasena) {
        List<Usuario> usuarios = new ArrayList<Usuario>();
        usuarios = repository.findByIdentificacion(nombre,contrasena);
        if (usuarios.isEmpty()) {
            return null;
        } else {
            return usuarios.get(0);
        }

    }


    
    @GetMapping("/identificacionJWT")
    public Usuario identificacionJWT(@RequestParam String email) {
        List<Usuario> usuarios = new ArrayList<Usuario>();
        usuarios = repository.findByEmail(email);
        if (usuarios.isEmpty()) {
            return null;
        } else {
            return usuarios.get(0);
        }

    }




    // obtener usuario por email similar
    @GetMapping("/buscarEmail/{email}")
    public Usuario buscarEmail(@PathVariable String email) {
        List<Usuario> usuarios = new ArrayList<Usuario>();
        usuarios = repository.findByEmail(email);
        if (usuarios.isEmpty()) {
            return null;
        } else {
            return usuarios.get(0);
        }
    }

    // eliminar usuario
    @DeleteMapping(value = "/{id}")
    public String borrarUsuarioById(@PathVariable int id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return "eliminado con exito";
        } else {
            return "no existe con ese id";
        }

    }

    // activar usuarios
    @PutMapping("/enabled")
    public String activarUsuarios(@RequestParam List<Integer> user_id) {
        int id_actualizar;
        int contadorActualizados = user_id.size();
        for (int i = 0; i < user_id.size(); i++) {//recorres la lista
            id_actualizar = user_id.get(i);

            if (repository.existsById(id_actualizar)) {//si se encuentra lo actualizas
                Usuario usuarioCorrespondiente = repository.findById(id_actualizar).get();

                usuarioCorrespondiente.setEnabled(true);

                repository.save(usuarioCorrespondiente);
                contadorActualizados--;

            }

        }

        if (contadorActualizados == 0) {
            return "se han actualizado todos";
        } else {
            return "no se han actualizado todos";
        }

    }

    @PutMapping("/disabled")//me llega en array ? los ids
    public String desactivarUsuarios(@RequestParam List<Integer> user_id) {
        int id_actualizar;
        int contadorActualizados = user_id.size();
        for (int i = 0; i < user_id.size(); i++) {
            id_actualizar = user_id.get(i);

            if (repository.existsById(id_actualizar)) {//recorres la lista y si se encuentra lo actualizas
                Usuario usuarioCorrespondiente = repository.findById(id_actualizar).get();

                usuarioCorrespondiente.setEnabled(false);

                repository.save(usuarioCorrespondiente);
                contadorActualizados--;

            }

        }

        if (contadorActualizados == 0) {
            return "se han actualizado todos";
        } else {
            return "no se han actualizado todos";
        }

    }

}

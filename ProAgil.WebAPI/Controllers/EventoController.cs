﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ProAgil.Domain;
using ProAgil.Repository;

namespace ProAgil.WebAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EventoController : ControllerBase
    {
        private readonly ILogger<EventoController> _logger;
        public IProAgilRepository _repo { get; }

        public EventoController(ILogger<EventoController> logger, IProAgilRepository repo)
        {
            this._repo = repo;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {

                var results = await _repo.GetAllEventosAsync(true);
                return Ok(results);

            }
            catch (System.Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                var results = await _repo.GetEventoAsync(id, true);
                return Ok(results);
            }
            catch (System.Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

        }

        [HttpGet("getByTema{tema}")]
        public async Task<IActionResult> Get(string tema)
        {
            try
            {
                var results = await _repo.GetAllPalestrantesAsyncByName(tema, true);
                return Ok(results);
            }
            catch (System.Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

        }

        [HttpPost]
        public async Task<IActionResult> Post(Evento model){
            try
            {
                _repo.Add(model);

                if(await _repo.SaveChangesAsync()){
                    return Created($"/evento/{model.Id}", model);

                }

            }
            catch (System.Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

            return BadRequest();

        }

        [HttpPut("{EventoId}")]
        public async Task<IActionResult> Put(int EventoId, Evento model){
            try
            {
                var evento = await _repo.GetEventoAsync(EventoId, false);

                if(evento == null) return NotFound();

                _repo.Update(model);

                if(await _repo.SaveChangesAsync()){
                    return Created($"/evento/{model.Id}", model);

                }

            }
            catch (System.Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

            return BadRequest();

        }

        [HttpDelete("{EventoId}")]
        public async Task<IActionResult> Delete(int EventoId){
            try
            {
                var evento = await _repo.GetEventoAsync(EventoId, false);

                if(evento == null) return NotFound();

                _repo.Delete(evento);

                if(await _repo.SaveChangesAsync()){
                    return Ok();
                }

            }
            catch (System.Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

            return BadRequest();

        }
        
    }
}

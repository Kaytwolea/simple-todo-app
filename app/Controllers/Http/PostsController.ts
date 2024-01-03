// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContext } from "@adonisjs/core/build/standalone";

export default class PostsController {
  /**
   * home
{ view }   */
  public home({ view }: HttpContextContract) {
    return view.render('tasks/index')
  }

  /**
   * about
{view}: HttpContextContract   */
  public about({ view, params }: HttpContextContract) {
    const name = params.name
    return view.render('about', { name })
  }

  /**
   * contact
{ view }: HttpContextContract   */
  public contact({ view }: HttpContextContract) {
    return view.render('contact')
  }
}

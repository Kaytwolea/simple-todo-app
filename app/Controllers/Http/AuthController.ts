// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContext } from "@adonisjs/core/build/standalone";
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { validator } from '../../../config/app';
import User from "App/Models/User";

export default class AuthController {
  public showRegister({ view }: HttpContext) {
    return view.render('auth/register')
  }

  public async register({ request, auth, response }: HttpContextContract) {
    const validation = schema.create({
      name: schema.string({ trim: true }),
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.maxLength(33),
        rules.unique({ table: 'users', column: 'email' })
      ]),
      password: schema.string({ trim: true }, [
        rules.confirmed(),
      ])
    })

    const validated = await request.validate({
      schema: validation,
    })

    const user = await User.create(validated)

    await auth.login(user)

    return response.redirect('/')
  }

  public async logout({ auth, response }: HttpContextContract) {
    await auth.logout()

    return response.redirect('/')
  }

  public showLogin({ view }: HttpContextContract) {
    return view.render('auth/login')
  }

  public async login({ request, auth, session, response }: HttpContextContract) {
    const { email, password } = request.all()

    try {
      await auth.attempt(email, password)

      return response.redirect('/')
    } catch (err) {
      session.flash('notification', 'User not found')

      return response.redirect('back')
    }
  }
}

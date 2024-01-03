// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

// import { HttpContext } from '@adonisjs/core/build/standalone';
import Task from 'App/Models/Task'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContext } from '@adonisjs/core/build/standalone'
import PostsController from './PostsController'
import User from '../../Models/User';

export default class TasksController {
  public async index({ view, auth }: HttpContextContract) {
    const user = auth.user
    await user?.preload('tasks')
    const tasks = await Task.all()
    return view.render('tasks/index', { tasks: user?.tasks })
  }

  /**
   * async store
{ request, response }: HttpContextContract   */
  public async store({ request, response, session, auth }: HttpContextContract) {
    const validationSchema = schema.create({
      title: schema.string({ trim: true }, [
        rules.maxLength(255),
      ]),
    })

    const validatedData = await request.validate({
      schema: validationSchema,
      messages: {
        'title.required': 'Enter task title',
        'title.maxLength': 'Cannot exceed max length',
      }
    })

    await Task.create({
      title: validatedData.title,
      user_id: auth.user.id,
    })

    session.flash('notification', 'Task created successfully')

    return response.redirect('back')
  }

  public async update({ request, response, session, params }: HttpContextContract) {
    const task = await Task.findOrFail(params.id)
    task.is_completed = !!request.input('completed')
    await task.save()

    session.flash('notification', 'Task updated successfully')
    return response.redirect('back')
  }

  public async destroy({ params, session, response }: HttpContext) {
    const task = await Task.findOrFail(params.id)

    await task.delete()

    session.flash('notification', 'Task deleted successfully')

    return response.redirect('back')
  }
}

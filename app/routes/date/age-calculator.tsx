import { Box, Button, Group, NativeSelect } from '@mantine/core'
import { useForm } from '@mantine/hooks'
import type { ActionFunction, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form, useActionData, useTransition } from '@remix-run/react'
import { getDaysInMonth, intervalToDuration } from 'date-fns'
import _ from 'lodash'

export const meta: MetaFunction = () => {
  return {
    title: 'Age Calculator',
  }
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()

  const year = formData.get('year')
  const month = formData.get('month')
  const day = formData.get('day')

  const date = new Date(year, month, day)
  return json(
    intervalToDuration({
      start: date,
      end: new Date(),
    })
  )
}

export default function AgeCalculator() {
  const actionData = useActionData<Duration>()
  const transition = useTransition()
  const dateForm = useForm({
    initialValues: {
      year: new Date().getFullYear(),
      month: 1,
      day: 1,
    },
  })

  const { year, month, day } = dateForm.values
  const daysList = _.range(1, getDaysInMonth(new Date(year, month)) + 1).map(
    String
  )

  return (
    <Box sx={{ maxWidth: 300 }} mx="auto">
      {actionData && <pre>{JSON.stringify(actionData)}</pre>}
      <Form method="post">
        <Group position="center">
          <NativeSelect
            // get the last 100 years list
            data={_.range(year, year - 100 + 1).map(String)}
            {...dateForm.getInputProps('year')}
            name="year"
            size="sm"
            label="Year"
          />
          <NativeSelect
            data={_.range(1, 12 + 1).map(String)}
            {...dateForm.getInputProps('month')}
            name="month"
            size="sm"
            label="Month"
          />
          <NativeSelect
            data={daysList}
            {...dateForm.getInputProps('day')}
            name="day"
            size="sm"
            label="Day"
          />
        </Group>
        <Group position="center" mt="md">
          <Button type="submit" loading={transition.state === 'submitting'}>
            Submit
          </Button>
        </Group>
      </Form>
    </Box>
  )
}

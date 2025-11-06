from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='HABITACION',
            fields=[
                ('id_habitacion', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=100)),
                ('descripcion', models.TextField(blank=True)),
                ('forma_svg', models.TextField()),
            ],
            options={
                'db_table': 'HABITACION',
            },
        ),
        migrations.CreateModel(
            name='THERMOSTATO',
            fields=[
                ('id_thermostato', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=100)),
                ('id_habitacion', models.ForeignKey(on_delete=models.deletion.CASCADE, db_column='id_habitacion', to='core.habitacion')),
            ],
            options={
                'db_table': 'THERMOSTATO',
            },
        ),
        migrations.CreateModel(
            name='MEDICION_THERMOSTATO',
            fields=[
                ('id_medicionthermostato', models.AutoField(primary_key=True, serialize=False)),
                ('valor', models.IntegerField()),
                ('unidad', models.CharField(max_length=100)),
                ('timestamp', models.DateTimeField()),
                ('id_thermostato', models.ForeignKey(on_delete=models.deletion.CASCADE, db_column='id_thermostato', to='core.thermostato')),
            ],
            options={
                'db_table': 'MEDICION_THERMOSTATO',
            },
        ),
    ]
